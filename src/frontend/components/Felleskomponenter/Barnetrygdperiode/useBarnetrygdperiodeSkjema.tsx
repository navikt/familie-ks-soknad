import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IBarnMedISøknad } from '../../../typer/barn';
import { PersonType } from '../../../typer/personType';
import { IBarnetrygdperioderFeltTyper } from '../../../typer/skjema';
import { dagenEtterDato, dagensDato, gårsdagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import {
    barnetrygdslandFeilmelding,
    mottarBarnetrygdNåFeilmelding,
} from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

export interface IUsePensjonsperiodeSkjemaParams {
    personType: PersonType;
    erDød?: boolean;
    barn: IBarnMedISøknad;
}

export const useBarnetrygdperiodeSkjema = (personType: PersonType, barn, erDød) => {
    const mottarEøsBarnetrygdNå = useJaNeiSpmFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå, svar: null },
        feilmeldingSpråkId: mottarBarnetrygdNåFeilmelding(personType),
        feilmeldingSpråkVerdier: { barn: barn.navn },
        skalSkjules: erDød,
    });

    const andreForelderErDød = personType === PersonType.AndreForelder && erDød;

    const periodenErAvsluttet = mottarEøsBarnetrygdNå.verdi === ESvar.NEI || andreForelderErDød;

    const barnetrygdsland = useLanddropdownFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.barnetrygdsland, svar: '' },
        feilmeldingSpråkId: barnetrygdslandFeilmelding(periodenErAvsluttet, personType),
        skalFeltetVises:
            mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK || andreForelderErDød,
        nullstillVedAvhengighetEndring: true,
        feilmeldingSpråkVerdier: { barn: barn.navn },
    });

    const fraDatoBarnetrygdperiode = useDatovelgerFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises:
            mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK || andreForelderErDød,
        feilmeldingSpråkId: 'modal.trygdnårbegynte.feilmelding',
        sluttdatoAvgrensning: periodenErAvsluttet ? gårsdagensDato() : dagensDato(),
        nullstillVedAvhengighetEndring: true,
    });

    const tilDatoBarnetrygdperiode = useDatovelgerFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises: periodenErAvsluttet || andreForelderErDød,
        feilmeldingSpråkId: 'modal.trygdnåravsluttet.spm',
        sluttdatoAvgrensning: dagensDato(),
        startdatoAvgrensning: dagenEtterDato(fraDatoBarnetrygdperiode.verdi),
    });

    const månedligBeløp = useFelt<string>({
        verdi: '',
        feltId: BarnetrygdperiodeSpørsmålId.månedligBeløp,
        valideringsfunksjon: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[0-9\s.\\/]{1,7}$/)) {
                return ok(felt);
            } else {
                return feil(
                    felt,
                    <SpråkTekst
                        id={
                            verdi === ''
                                ? 'ombarnet.trygdbeløp.feilmelding'
                                : 'ombarnet.trygdbeløp.format.feilmelding'
                        }
                    />
                );
            }
        },

        skalFeltetVises: avhengigheter =>
            avhengigheter.mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK ||
            andreForelderErDød,
        avhengigheter: { mottarEøsBarnetrygdNå },
    });

    const skjema = useSkjema<IBarnetrygdperioderFeltTyper, 'string'>({
        felter: {
            mottarEøsBarnetrygdNå,
            barnetrygdsland,
            fraDatoBarnetrygdperiode,
            tilDatoBarnetrygdperiode,
            månedligBeløp,
        },

        skjemanavn: 'barnetrygdperioder',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
