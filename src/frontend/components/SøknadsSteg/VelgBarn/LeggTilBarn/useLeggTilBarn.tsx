import { ESvar } from '@navikt/familie-form-elements';
import {
    feil,
    FeltState,
    ISkjema,
    ok,
    useFelt,
    useSkjema,
    Valideringsstatus,
} from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import useInputFeltMedUkjent from '../../../../hooks/useInputFeltMedUkjent';
import { ESvarMedUbesvart, LocaleRecordBlock } from '../../../../typer/common';
import { ILeggTilBarnTekstinnhold } from '../../../../typer/sanity/modaler/leggTilBarn';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { ILeggTilBarnTyper } from '../../../../typer/skjema';
import {
    erBarnRegistrertFraFør,
    erBarnUnder11Mnd,
    hentAlder,
    hentUid,
} from '../../../../utils/barn';
import { trimWhiteSpace } from '../../../../utils/hjelpefunksjoner';
import { identTilFødselsdato } from '../../../../utils/ident';
import { VelgBarnSpørsmålId } from '../spørsmål';

export const useLeggTilBarn = (): {
    skjema: ISkjema<ILeggTilBarnTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    nullstillSkjema: () => void;
    leggTilBarn: () => void;
} => {
    const { søknad, settSøknad, tekster, plainTekst } = useApp();

    const teksterForModal: ILeggTilBarnTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.leggTilBarn;

    const navnIkkeBestemtTekst: LocaleRecordBlock =
        tekster()[ESanitySteg.VELG_BARN].navnIkkeBestemtLabel;

    const erFødt = useFelt<ESvarMedUbesvart>({
        verdi: null,
        feltId: VelgBarnSpørsmålId.leggTilBarnErFødt,
        valideringsfunksjon: felt => {
            switch (felt.verdi) {
                case ESvar.JA:
                    return ok(felt);
                case ESvar.NEI:
                    return feil(felt, plainTekst(teksterForModal.barnIkkeFoedtFeilmelding));
                default:
                    return feil(felt, plainTekst(teksterForModal.erBarnetFoedt.feilmelding));
            }
        },
    });

    const navnetErUbestemt = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: VelgBarnSpørsmålId.leggTilBarnNavnIkkeBestemt,
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        avhengigheter: { erFødt },
    });

    const fornavn = useInputFeltMedUkjent({
        søknadsfelt: {
            id: VelgBarnSpørsmålId.leggTilBarnFornavn,
            svar: '',
        },
        avhengighet: navnetErUbestemt,
        feilmelding: teksterForModal.fornavn.feilmelding,
        skalVises: erFødt.valideringsstatus === Valideringsstatus.OK,
    });

    const etternavn = useInputFeltMedUkjent({
        søknadsfelt: {
            id: VelgBarnSpørsmålId.leggTilBarnEtternavn,
            svar: '',
        },
        avhengighet: navnetErUbestemt,
        feilmelding: teksterForModal.etternavn.feilmelding,
        skalVises: erFødt.valideringsstatus === Valideringsstatus.OK,
    });

    const ikkeFåttIdentChecked = useFelt<ESvar>({
        verdi: ESvar.NEI,
        valideringsfunksjon: felt =>
            felt.verdi === ESvar.NEI
                ? ok(felt)
                : feil(felt, plainTekst(teksterForModal.foedselsnummerFeilmelding)),
        skalFeltetVises: ({ erFødt }) => erFødt.verdi === ESvar.JA,
        avhengigheter: { erFødt },
    });

    const ident = useInputFeltMedUkjent({
        søknadsfelt: {
            id: VelgBarnSpørsmålId.leggTilBarnFnr,
            svar: '',
        },
        avhengighet: ikkeFåttIdentChecked,
        feilmelding: teksterForModal.foedselsnummerEllerDNummer.feilmelding,
        erFnrInput: true,
        skalVises: erFødt.valideringsstatus === Valideringsstatus.OK,
        customValidering: (felt: FeltState<string>) => {
            return erBarnRegistrertFraFør(søknad, felt.verdi)
                ? feil(felt, plainTekst(teksterForModal.sammeFoedselsnummerFeilmelding))
                : ok(felt);
        },
    });

    const { skjema, kanSendeSkjema, valideringErOk, nullstillSkjema } = useSkjema<
        ILeggTilBarnTyper,
        string
    >({
        felter: {
            erFødt,
            fornavn,
            etternavn,
            navnetErUbestemt,
            ident,
            ikkeFåttIdentChecked,
        },
        skjemanavn: 'velgbarn',
    });

    const fulltNavn = () => {
        return fornavn.verdi && etternavn.verdi
            ? trimWhiteSpace(`${fornavn.verdi} ${etternavn.verdi}`)
            : '';
    };

    const leggTilBarn = () => {
        const fødselsdato = identTilFødselsdato(ident.verdi);
        settSøknad({
            ...søknad,
            barnRegistrertManuelt: søknad.barnRegistrertManuelt.concat([
                {
                    id: hentUid(),
                    navn: fulltNavn() || plainTekst(navnIkkeBestemtTekst),
                    ident: ident.verdi,
                    borMedSøker: undefined,
                    alder: hentAlder(fødselsdato),
                    erUnder11Mnd: erBarnUnder11Mnd(fødselsdato),
                    adressebeskyttelse: false,
                },
            ]),
        });
        nullstillSkjema();
    };

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        nullstillSkjema,
        leggTilBarn,
    };
};
