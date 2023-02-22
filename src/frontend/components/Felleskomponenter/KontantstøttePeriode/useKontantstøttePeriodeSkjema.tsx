import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { PersonType } from '../../../typer/personType';
import { IEøsYtelseTekstinnhold } from '../../../typer/sanity/modaler/eøsYtelse';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IKontantstøttePerioderFeltTyper } from '../../../typer/skjema';
import { dagenEtterDato, dagensDato, gårsdagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { KontantstøttePeriodeSpørsmålId } from './spørsmål';

export interface IUsePensjonsperiodeSkjemaParams {
    personType: PersonType;
    erDød?: boolean;
}

export const useKontantstøttePeriodeSkjema = (personType: PersonType, erDød) => {
    const { tekster, plainTekst } = useApp();
    const teksterForPersonType: IEøsYtelseTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.eøsYtelse[personType];

    const mottarEøsKontantstøtteNå = useJaNeiSpmFelt({
        søknadsfelt: { id: KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå, svar: null },
        feilmelding: teksterForPersonType.faarYtelserNaa.feilmelding,
        skalSkjules: erDød,
    });

    const andreForelderErDød = personType === PersonType.andreForelder && erDød;

    const periodenErAvsluttet = mottarEøsKontantstøtteNå.verdi === ESvar.NEI || andreForelderErDød;

    const kontantstøtteLand = useLanddropdownFelt({
        søknadsfelt: { id: KontantstøttePeriodeSpørsmålId.kontantstøtteLand, svar: '' },
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.ytelseLandFortid.feilmelding
            : teksterForPersonType.ytelseLandNaatid.feilmelding,
        skalFeltetVises:
            mottarEøsKontantstøtteNå.valideringsstatus === Valideringsstatus.OK ||
            andreForelderErDød,
        nullstillVedAvhengighetEndring: true,
    });

    const fraDatoKontantstøttePeriode = useDatovelgerFelt({
        søknadsfelt: { id: KontantstøttePeriodeSpørsmålId.fraDatoKontantstøttePeriode, svar: '' },
        skalFeltetVises:
            mottarEøsKontantstøtteNå.valideringsstatus === Valideringsstatus.OK ||
            andreForelderErDød,
        feilmelding: teksterForPersonType.startdato.feilmelding,

        sluttdatoAvgrensning: periodenErAvsluttet ? gårsdagensDato() : dagensDato(),
    });

    const tilDatoKontantstøttePeriode = useDatovelgerFelt({
        søknadsfelt: { id: KontantstøttePeriodeSpørsmålId.tilDatoKontantstøttePeriode, svar: '' },
        skalFeltetVises: periodenErAvsluttet || andreForelderErDød,
        feilmelding: teksterForPersonType.sluttdato.feilmelding,
        sluttdatoAvgrensning: dagensDato(),
        startdatoAvgrensning: fraDatoKontantstøttePeriode.verdi
            ? dagenEtterDato(new Date(fraDatoKontantstøttePeriode.verdi))
            : undefined,
    });

    const månedligBeløp = useFelt<string>({
        verdi: '',
        feltId: KontantstøttePeriodeSpørsmålId.månedligBeløp,
        valideringsfunksjon: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[\d\s.\\/]{1,20}$/)) {
                return ok(felt);
            } else {
                return feil(
                    felt,
                    plainTekst(
                        verdi === ''
                            ? teksterForPersonType.beloepPerMaaned.feilmelding
                            : tekster().FELLES.formateringsfeilmeldinger.ugyldigBeloep
                    )
                );
            }
        },

        skalFeltetVises: avhengigheter =>
            avhengigheter.mottarEøsKontantstøtteNå.valideringsstatus === Valideringsstatus.OK ||
            andreForelderErDød,
        avhengigheter: { mottarEøsKontantstøtteNå },
    });

    const skjema = useSkjema<IKontantstøttePerioderFeltTyper, 'string'>({
        felter: {
            mottarEøsKontantstøtteNå,
            kontantstøtteLand,
            fraDatoKontantstøttePeriode,
            tilDatoKontantstøttePeriode,
            månedligBeløp,
        },

        skjemanavn: 'kontantstøttePerioder',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
