import React from 'react';

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
import { erBarnRegistrertFraFør, hentUid } from '../../../../utils/barn';
import { trimWhiteSpace } from '../../../../utils/hjelpefunksjoner';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { VelgBarnSpørsmålId } from '../spørsmål';

export const useLeggTilBarn = (): {
    skjema: ISkjema<ILeggTilBarnTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    nullstillSkjema: () => void;
    leggTilBarn: () => void;
} => {
    const { søknad, settSøknad, mellomlagre, tekster, plainTekst } = useApp();

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
                    return feil(
                        felt,
                        <TekstBlock block={teksterForModal.barnIkkeFoedtFeilmelding} />
                    );
                default:
                    return feil(
                        felt,
                        <TekstBlock block={teksterForModal.erBarnetFoedt.feilmelding} />
                    );
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
        feilmelding: <TekstBlock block={teksterForModal.fornavn.feilmelding} />,
        skalVises: erFødt.valideringsstatus === Valideringsstatus.OK,
    });

    const etternavn = useInputFeltMedUkjent({
        søknadsfelt: {
            id: VelgBarnSpørsmålId.leggTilBarnEtternavn,
            svar: '',
        },
        avhengighet: navnetErUbestemt,
        feilmelding: <TekstBlock block={teksterForModal.etternavn.feilmelding} />,
        skalVises: erFødt.valideringsstatus === Valideringsstatus.OK,
    });

    const ikkeFåttIdentChecked = useFelt<ESvar>({
        verdi: ESvar.NEI,
        valideringsfunksjon: felt =>
            felt.verdi === ESvar.NEI
                ? ok(felt)
                : feil(felt, <TekstBlock block={teksterForModal.foedselsnummerFeilmelding} />),
        skalFeltetVises: ({ erFødt }) => erFødt.verdi === ESvar.JA,
        avhengigheter: { erFødt },
    });

    const ident = useInputFeltMedUkjent({
        søknadsfelt: {
            id: VelgBarnSpørsmålId.leggTilBarnFnr,
            svar: '',
        },
        avhengighet: ikkeFåttIdentChecked,
        feilmelding: <TekstBlock block={teksterForModal.foedselsnummerEllerDNummer.feilmelding} />,
        erFnrInput: true,
        skalVises: erFødt.valideringsstatus === Valideringsstatus.OK,
        customValidering: (felt: FeltState<string>) => {
            return erBarnRegistrertFraFør(søknad, felt.verdi)
                ? feil(felt, <TekstBlock block={teksterForModal.sammeFoedselsnummerFeilmelding} />)
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
        settSøknad({
            ...søknad,
            barnRegistrertManuelt: søknad.barnRegistrertManuelt.concat([
                {
                    id: hentUid(),
                    navn: fulltNavn() || plainTekst(navnIkkeBestemtTekst),
                    ident: ident.verdi,
                    borMedSøker: undefined,
                    alder: null,
                    adressebeskyttelse: false,
                },
            ]),
        });
        nullstillSkjema();
        mellomlagre();
    };

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        nullstillSkjema,
        leggTilBarn,
    };
};
