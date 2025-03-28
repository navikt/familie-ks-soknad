import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IBarnMedISøknad } from '../../../typer/barn';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IUsePeriodeSkjemaVerdi } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IPensjonsperiodeTekstinnhold } from '../../../typer/sanity/modaler/pensjonsperiode';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IPensjonsperiodeFeltTyper } from '../../../typer/skjema';
import {
    dagenEtterDato,
    dagensDato,
    sisteDagDenneMåneden,
    stringTilDate,
} from '../../../utils/dato';

import { mottarPensjonNåFeilmelding } from './språkUtils';
import { PensjonsperiodeSpørsmålId } from './spørsmål';

export interface IUsePensjonSkjemaParams {
    gjelderUtland: boolean;
    personType: PersonType;
    erDød?: boolean;
    barn?: IBarnMedISøknad;
}

export const usePensjonSkjema = ({
    gjelderUtland,
    personType,
    erDød,
    barn,
}: IUsePensjonSkjemaParams): IUsePeriodeSkjemaVerdi<IPensjonsperiodeFeltTyper> => {
    const { toggles } = useFeatureToggles();
    const { tekster } = useAppContext();
    const { erEøsLand } = useEøsContext();
    const teksterForPersonType: IPensjonsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.pensjonsperiode[personType];

    const erAndreForelderDød = personType === PersonType.andreForelder && !!erDød;

    const mottarPensjonNå = useJaNeiSpmFelt({
        søknadsfelt: { id: PensjonsperiodeSpørsmålId.mottarPensjonNå, svar: null },
        feilmelding: mottarPensjonNåFeilmelding({ personType, gjelderUtland, tekster: tekster() }),
        flettefelter: { barnetsNavn: barn?.navn },
        skalSkjules: erAndreForelderDød,
    });

    const periodenErAvsluttet = mottarPensjonNå.verdi === ESvar.NEI || erAndreForelderDød;

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [mottarPensjonNå.verdi]);

    const pensjonsland = useLanddropdownFelt({
        søknadsfelt: { id: PensjonsperiodeSpørsmålId.pensjonsland, svar: '' },
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.pensjonLandFortid.feilmelding
            : teksterForPersonType.pensjonLandNaatid.feilmelding,
        skalFeltetVises:
            (mottarPensjonNå.valideringsstatus === Valideringsstatus.OK || erAndreForelderDød) &&
            gjelderUtland,
        nullstillVedAvhengighetEndring: true,
    });

    const pensjonFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: PensjonsperiodeSpørsmålId.fraDatoPensjon,
            svar: '',
        },
        skalFeltetVises:
            (mottarPensjonNå.valideringsstatus === Valideringsstatus.OK || erAndreForelderDød) &&
            (!gjelderUtland || !!erEøsLand(pensjonsland.verdi)),
        feilmelding: teksterForPersonType.startdato.feilmelding,
        sluttdatoAvgrensning: toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO]
            ? sisteDagDenneMåneden()
            : dagensDato(),
        avhengigheter: { mottarPensjonNå },
    });

    const tilPensjonperiodeSluttdatoAvgrensning = toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO]
        ? sisteDagDenneMåneden()
        : dagensDato();

    const pensjonTilDato = useDatovelgerFelt({
        søknadsfelt: {
            id: PensjonsperiodeSpørsmålId.tilDatoPensjon,
            svar: '',
        },
        skalFeltetVises:
            (mottarPensjonNå.verdi === ESvar.NEI || erAndreForelderDød) &&
            (!gjelderUtland || !!erEøsLand(pensjonsland.verdi)),
        feilmelding: teksterForPersonType.sluttdato.feilmelding,
        sluttdatoAvgrensning: tilPensjonperiodeSluttdatoAvgrensning,
        startdatoAvgrensning: dagenEtterDato(stringTilDate(pensjonFraDato.verdi)),
        avhengigheter: { mottarPensjonNå, pensjonFraDato },
    });

    const skjema = useSkjema<IPensjonsperiodeFeltTyper, string>({
        felter: {
            mottarPensjonNå,
            pensjonsland,
            pensjonFraDato,
            pensjonTilDato,
        },
        skjemanavn: 'pensjonsperiode',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
