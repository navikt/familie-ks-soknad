import { ESvar } from '@navikt/familie-form-elements';
import { useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IUsePeriodeSkjemaVerdi } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { IArbeidsperioderFeltTyper } from '../../../typer/skjema';
import {
    dagensDato,
    erSammeDatoSomDagensDato,
    gårsdagensDato,
    sisteDagDenneMåneden,
    stringTilDate,
} from '../../../utils/dato';
import { minTilDatoForUtbetalingEllerArbeidsperiode } from '../../../utils/perioder';

import { ArbeidsperiodeSpørsmålsId } from './spørsmål';

export interface IUseArbeidsperiodeSkjemaParams {
    gjelderUtlandet: boolean;
    personType: PersonType;
    erDød?: boolean;
}

export const useArbeidsperiodeSkjema = (
    gjelderUtlandet: boolean,
    personType: PersonType,
    erDød = false
): IUsePeriodeSkjemaVerdi<IArbeidsperioderFeltTyper> => {
    const { toggles } = useFeatureToggles();
    const { tekster, plainTekst } = useAppContext();
    const teksterForPersonType: IArbeidsperiodeTekstinnhold =
        tekster().FELLES.modaler.arbeidsperiode[personType];

    const andreForelderErDød = personType === PersonType.andreForelder && erDød;

    const arbeidsperiodeAvsluttet = useJaNeiSpmFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet, svar: null },
        feilmelding: teksterForPersonType.arbeidsperiodenAvsluttet.feilmelding,
        skalSkjules: andreForelderErDød,
    });

    const periodenErAvsluttet = arbeidsperiodeAvsluttet.verdi === ESvar.JA || andreForelderErDød;

    const adresseTekst = periodenErAvsluttet
        ? teksterForPersonType.adresseFortid
        : teksterForPersonType.adresseNaatid;

    const arbeidsperiodeLand = useLanddropdownFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand, svar: '' },
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.hvilketLandFortid.feilmelding
            : teksterForPersonType.hvilketLandNaatid.feilmelding,
        skalFeltetVises:
            (arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
                andreForelderErDød) &&
            gjelderUtlandet,
        nullstillVedAvhengighetEndring: true,
    });

    const arbeidsgiver = useInputFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsgiver, svar: '' },
        feilmelding: teksterForPersonType.arbeidsgiver.feilmelding,
        skalVises:
            arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
            andreForelderErDød,
    });

    const fraDatoArbeidsperiode = useDatovelgerFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode, svar: '' },
        skalFeltetVises:
            arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
            andreForelderErDød,
        feilmelding: teksterForPersonType.startdato.feilmelding,
        sluttdatoAvgrensning: periodenErAvsluttet ? gårsdagensDato() : dagensDato(),
    });

    const tilDatoArbeidsperiodeUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke,
        skalFeltetVises: avhengigheter =>
            avhengigheter?.arbeidsperiodeAvsluttet?.verdi === ESvar.NEI,
        avhengigheter: { arbeidsperiodeAvsluttet },
    });

    const tilArbeidsperiodeSluttdatoAvgrensning = toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO]
        ? sisteDagDenneMåneden()
        : dagensDato();

    const tilDatoArbeidsperiode = useDatovelgerFeltMedUkjent({
        feltId: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
        initiellVerdi: '',
        vetIkkeCheckbox: tilDatoArbeidsperiodeUkjent,
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.sluttdatoFortid.feilmelding
            : teksterForPersonType.sluttdatoFremtid.feilmelding,
        skalFeltetVises:
            arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
            andreForelderErDød,
        sluttdatoAvgrensning: periodenErAvsluttet
            ? tilArbeidsperiodeSluttdatoAvgrensning
            : undefined,
        startdatoAvgrensning: minTilDatoForUtbetalingEllerArbeidsperiode(
            periodenErAvsluttet,
            fraDatoArbeidsperiode.verdi
        ),
        customStartdatoFeilmelding:
            erSammeDatoSomDagensDato(stringTilDate(fraDatoArbeidsperiode.verdi)) ||
            periodenErAvsluttet
                ? undefined
                : plainTekst(
                      tekster().FELLES.formateringsfeilmeldinger.datoKanIkkeVaereTilbakeITid
                  ),
        avhengigheter: { fraDatoArbeidsperiode },
        nullstillVedAvhengighetEndring: false,
    });

    const adresseUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: ArbeidsperiodeSpørsmålsId.adresseVetIkke,
        skalFeltetVises: () =>
            gjelderUtlandet &&
            (arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
                andreForelderErDød),
        avhengigheter: { arbeidsperiodeAvsluttet },
        nullstillVedAvhengighetEndring: false,
    });

    const adresse = useInputFeltMedUkjent({
        søknadsfelt: {
            id: ArbeidsperiodeSpørsmålsId.adresse,
            svar: '',
        },
        avhengighet: adresseUkjent,
        feilmelding: adresseTekst.feilmelding,
        skalVises:
            gjelderUtlandet &&
            (arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
                andreForelderErDød),
    });

    const skjema = useSkjema<IArbeidsperioderFeltTyper, string>({
        felter: {
            arbeidsperiodeAvsluttet,
            arbeidsperiodeLand,
            arbeidsgiver,
            fraDatoArbeidsperiode,
            tilDatoArbeidsperiode,
            tilDatoArbeidsperiodeUkjent,
            adresse,
            adresseUkjent,
        },
        skjemanavn: 'arbeidsperioder',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
