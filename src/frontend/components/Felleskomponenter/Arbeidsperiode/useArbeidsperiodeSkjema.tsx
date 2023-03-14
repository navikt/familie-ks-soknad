import { ESvar } from '@navikt/familie-form-elements';
import { useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IUsePeriodeSkjemaVerdi } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { IArbeidsperioderFeltTyper } from '../../../typer/skjema';
import {
    dagensDato,
    erSammeDatoSomDagensDato,
    gårsdagensDato,
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
    const { tekster, plainTekst } = useApp();
    const { erEøsLand } = useEøs();
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
        skalVises: gjelderUtlandet
            ? erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
              andreForelderErDød,
    });

    const fraDatoArbeidsperiode = useDatovelgerFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode, svar: '' },
        skalFeltetVises: gjelderUtlandet
            ? !!erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
              andreForelderErDød,
        feilmelding: teksterForPersonType.startdato.feilmelding,
        sluttdatoAvgrensning: periodenErAvsluttet ? gårsdagensDato() : dagensDato(),
    });

    const tilDatoArbeidsperiodeUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke,
        skalFeltetVises: avhengigheter => {
            if (avhengigheter.arbeidsperiodeAvsluttet?.verdi !== ESvar.NEI) return false;
            return gjelderUtlandet ? !!erEøsLand(avhengigheter.arbeidsperiodeLand?.verdi) : true;
        },
        avhengigheter: { arbeidsperiodeAvsluttet, arbeidsperiodeLand },
    });

    const tilDatoArbeidsperiode = useDatovelgerFeltMedUkjent({
        feltId: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
        initiellVerdi: '',
        vetIkkeCheckbox: tilDatoArbeidsperiodeUkjent,
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.sluttdatoFortid.feilmelding
            : teksterForPersonType.sluttdatoFremtid.feilmelding,
        skalFeltetVises: gjelderUtlandet
            ? !!erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
              andreForelderErDød,
        sluttdatoAvgrensning: periodenErAvsluttet ? dagensDato() : undefined,
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
    });

    const adresseUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: ArbeidsperiodeSpørsmålsId.adresseVetIkke,
        skalFeltetVises: avhengigheter =>
            gjelderUtlandet && !!erEøsLand(avhengigheter.arbeidsperiodeLand?.verdi),
        avhengigheter: { arbeidsperiodeAvsluttet, arbeidsperiodeLand },
        nullstillVedAvhengighetEndring: false,
    });

    const adresse = useInputFeltMedUkjent({
        søknadsfelt: {
            id: ArbeidsperiodeSpørsmålsId.adresse,
            svar: '',
        },
        avhengighet: adresseUkjent,
        feilmelding: adresseTekst.feilmelding,
        skalVises: gjelderUtlandet && !!erEøsLand(arbeidsperiodeLand.verdi),
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
