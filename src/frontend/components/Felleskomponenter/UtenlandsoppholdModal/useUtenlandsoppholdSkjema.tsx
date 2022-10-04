import React, { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IUtenlandsoppholdFeltTyper } from '../../../typer/skjema';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { dagenEtterDato } from '../../../utils/dato';
import {
    harTilhørendeFomFelt,
    hentMinAvgrensningPåTilDato,
    hentMaxAvgrensningPåFraDato,
    hentMaxAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from './spørsmål';
import {
    fraDatoFeilmeldingSpråkId,
    landFeilmeldingTekst,
    tilDatoFeilmeldingSpråkId,
    årsakFeilmeldingSpråkId,
} from './utenlandsoppholdSpråkUtils';

export interface IUseUtenlandsoppholdSkjemaParams {
    personType: PersonType;
}

export const useUtenlandsoppholdSkjema = ({ personType }: IUseUtenlandsoppholdSkjemaParams) => {
    const { tekster } = useApp();
    const teksterForPersontype = tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold[personType];

    const utenlandsoppholdÅrsak = useFelt<EUtenlandsoppholdÅrsak | ''>({
        feltId: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
        verdi: '',
        valideringsfunksjon: (felt: FeltState<EUtenlandsoppholdÅrsak | ''>) =>
            felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={årsakFeilmeldingSpråkId(personType)} />),
    });

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [utenlandsoppholdÅrsak.verdi]);

    const oppholdsland = useLanddropdownFelt({
        søknadsfelt: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: '' },
        feilmelding: landFeilmeldingTekst(utenlandsoppholdÅrsak.verdi, teksterForPersontype),
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
        feilmeldingSpråkId: fraDatoFeilmeldingSpråkId(utenlandsoppholdÅrsak.verdi, personType),
        sluttdatoAvgrensning: hentMaxAvgrensningPåFraDato(utenlandsoppholdÅrsak.verdi),
        avhengigheter: { utenlandsoppholdÅrsak },
        nullstillVedAvhengighetEndring: true,
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
        feilmeldingSpråkId: tilDatoFeilmeldingSpråkId(utenlandsoppholdÅrsak.verdi, personType),
        skalFeltetVises:
            !!utenlandsoppholdÅrsak.verdi &&
            utenlandsoppholdÅrsak.verdi !== EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE,
        sluttdatoAvgrensning: hentMaxAvgrensningPåTilDato(utenlandsoppholdÅrsak.verdi),
        startdatoAvgrensning: harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
            ? dagenEtterDato(oppholdslandFraDato.verdi)
            : hentMinAvgrensningPåTilDato(utenlandsoppholdÅrsak.verdi),
        customStartdatoFeilmelding: !harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
            ? utenlandsoppholdÅrsak.verdi === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE
                ? 'felles.dato.tilbake-i-tid.feilmelding'
                : 'modal.nårflyttettilnorge.mer-enn-ett-år.feilmelding'
            : undefined,
        avhengigheter: { utenlandsoppholdÅrsak },
    });

    const skjema = useSkjema<IUtenlandsoppholdFeltTyper, 'string'>({
        felter: {
            utenlandsoppholdÅrsak,
            oppholdsland,
            oppholdslandFraDato,
            oppholdslandTilDato,
            oppholdslandTilDatoUkjent,
        },
        skjemanavn: 'utenlandsopphold',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
