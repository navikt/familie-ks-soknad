import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import {
    feil,
    type FeltState,
    ok,
    useFelt,
    useSkjema,
    Valideringsstatus,
} from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IUsePeriodeSkjemaVerdi } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { ESanitySteg, ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { IUtenlandsoppholdFeltTyper } from '../../../typer/skjema';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { dagenEtterDato, stringTilDate } from '../../../utils/dato';
import {
    harTilhørendeFomFelt,
    hentMaxAvgrensningPåFraDato,
    hentMaxAvgrensningPåTilDato,
    hentMinAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';

import { UtenlandsoppholdSpørsmålId } from './spørsmål';
import {
    hentFraDatoFeilmelding,
    hentLandFeilmelding,
    hentTilDatoFeilmelding,
} from './utenlandsoppholdSpråkUtils';

export interface IUseUtenlandsoppholdSkjemaParams {
    personType: PersonType;
}

export const useUtenlandsoppholdSkjema = ({
    personType,
}: IUseUtenlandsoppholdSkjemaParams): IUsePeriodeSkjemaVerdi<IUtenlandsoppholdFeltTyper> => {
    const { tekster, plainTekst } = useApp();
    const teksterForPersontype: IUtenlandsoppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold[personType];

    const utenlandsoppholdÅrsak = useFelt<EUtenlandsoppholdÅrsak | ''>({
        feltId: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
        verdi: '',
        valideringsfunksjon: (felt: FeltState<EUtenlandsoppholdÅrsak | ''>) =>
            felt.verdi !== ''
                ? ok(felt)
                : feil(felt, plainTekst(teksterForPersontype.periodeBeskrivelse.feilmelding)),
    });

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [utenlandsoppholdÅrsak.verdi]);

    const adresseTekst: ISanitySpørsmålDokument | undefined =
        utenlandsoppholdÅrsak.verdi === EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE ||
        utenlandsoppholdÅrsak.verdi === EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE
            ? teksterForPersontype.adresseFortid
            : teksterForPersontype.adresseNaatid;

    const oppholdsland = useLanddropdownFelt({
        søknadsfelt: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: '' },
        feilmelding: hentLandFeilmelding(utenlandsoppholdÅrsak.verdi, teksterForPersontype),
        skalFeltetVises: !!utenlandsoppholdÅrsak.verdi,
        nullstillVedAvhengighetEndring: true,
    });

    const oppholdslandFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
            svar: '',
        },
        skalFeltetVises:
            !!utenlandsoppholdÅrsak.verdi &&
            utenlandsoppholdÅrsak.verdi !== EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE,
        feilmelding: hentFraDatoFeilmelding(utenlandsoppholdÅrsak.verdi, teksterForPersontype),
        sluttdatoAvgrensning: hentMaxAvgrensningPåFraDato(utenlandsoppholdÅrsak.verdi),
        avhengigheter: { utenlandsoppholdÅrsak },
    });

    const oppholdslandTilDatoUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsoppholdVetIkke,
        skalFeltetVises: avhengigheter =>
            !!avhengigheter.utenlandsoppholdÅrsak.verdi &&
            avhengigheter.utenlandsoppholdÅrsak.verdi ===
                EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
        avhengigheter: { utenlandsoppholdÅrsak },
    });

    const oppholdslandTilDato = useDatovelgerFeltMedUkjent({
        feltId: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
        initiellVerdi: '',
        vetIkkeCheckbox: oppholdslandTilDatoUkjent,
        feilmelding: hentTilDatoFeilmelding(utenlandsoppholdÅrsak.verdi, teksterForPersontype),
        skalFeltetVises:
            !!utenlandsoppholdÅrsak.verdi &&
            utenlandsoppholdÅrsak.verdi !== EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE,
        sluttdatoAvgrensning: hentMaxAvgrensningPåTilDato(utenlandsoppholdÅrsak.verdi),
        startdatoAvgrensning: harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
            ? dagenEtterDato(stringTilDate(oppholdslandFraDato.verdi))
            : hentMinAvgrensningPåTilDato(utenlandsoppholdÅrsak.verdi),
        customStartdatoFeilmelding: !harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
            ? utenlandsoppholdÅrsak.verdi === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE
                ? plainTekst(tekster().FELLES.formateringsfeilmeldinger.datoKanIkkeVaereTilbakeITid)
                : plainTekst(
                      tekster().FELLES.formateringsfeilmeldinger.datoKanIkkeVaere12MndTilbake
                  )
            : undefined,
        avhengigheter: { utenlandsoppholdÅrsak, oppholdslandFraDato },
        nullstillVedAvhengighetEndring: false,
    });

    const adresseUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: UtenlandsoppholdSpørsmålId.adresseUkjent,
        skalFeltetVises: avhengigheter =>
            personType !== PersonType.barn && !!avhengigheter.utenlandsoppholdÅrsak.verdi,
        avhengigheter: { utenlandsoppholdÅrsak },
        nullstillVedAvhengighetEndring: false,
    });

    const adresse = useInputFeltMedUkjent({
        søknadsfelt: {
            id: UtenlandsoppholdSpørsmålId.adresse,
            svar: '',
        },
        avhengighet: adresseUkjent,
        feilmelding: adresseTekst?.feilmelding,
        skalVises:
            personType !== PersonType.barn &&
            utenlandsoppholdÅrsak.valideringsstatus === Valideringsstatus.OK,
    });

    const skjema = useSkjema<IUtenlandsoppholdFeltTyper, string>({
        felter: {
            utenlandsoppholdÅrsak,
            oppholdsland,
            oppholdslandFraDato,
            oppholdslandTilDato,
            oppholdslandTilDatoUkjent,
            adresse,
            adresseUkjent,
        },
        skjemanavn: 'utenlandsopphold',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
