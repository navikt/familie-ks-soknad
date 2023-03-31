import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { UseSkjemaVerdi } from '@navikt/familie-skjema';

import { EBarnehageplassPeriodeBeskrivelse } from '../components/Felleskomponenter/Barnehagemodal/barnehageplassTyper';
import { AlternativtSvarForInput, DatoMedUkjent, ISODateString } from './common';
import { ISøknadSpørsmål } from './spørsmål';
import { EUtenlandsoppholdÅrsak } from './utenlandsopphold';

export interface IUtenlandsperiode {
    utenlandsoppholdÅrsak: ISøknadSpørsmål<EUtenlandsoppholdÅrsak>;
    oppholdsland: ISøknadSpørsmål<Alpha3Code | ''>;
    oppholdslandFraDato?: ISøknadSpørsmål<ISODateString>;
    oppholdslandTilDato?: ISøknadSpørsmål<DatoMedUkjent>;
    adresse?: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
}

export interface IArbeidsperiode {
    arbeidsperiodeAvsluttet: ISøknadSpørsmål<ESvar | null>;
    arbeidsperiodeland: ISøknadSpørsmål<Alpha3Code | ''>;
    arbeidsgiver: ISøknadSpørsmål<string>;
    fraDatoArbeidsperiode: ISøknadSpørsmål<ISODateString | ''>;
    tilDatoArbeidsperiode: ISøknadSpørsmål<DatoMedUkjent | ''>;
    adresse: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
}

export interface IPensjonsperiode {
    mottarPensjonNå: ISøknadSpørsmål<ESvar | null>;
    pensjonsland: ISøknadSpørsmål<Alpha3Code | ''>;
    pensjonFra: ISøknadSpørsmål<ISODateString | ''>;
    pensjonTil: ISøknadSpørsmål<ISODateString | ''>;
}

export interface IUtbetalingsperiode {
    fårUtbetalingNå: ISøknadSpørsmål<ESvar | null>;
    utbetalingLand: ISøknadSpørsmål<Alpha3Code | ''>;
    utbetalingFraDato: ISøknadSpørsmål<ISODateString>;
    utbetalingTilDato: ISøknadSpørsmål<DatoMedUkjent>;
}

export interface IEøsKontantstøttePeriode {
    mottarEøsKontantstøtteNå: ISøknadSpørsmål<ESvar | null>;
    kontantstøtteLand: ISøknadSpørsmål<Alpha3Code | ''>;
    fraDatoKontantstøttePeriode: ISøknadSpørsmål<ISODateString>;
    tilDatoKontantstøttePeriode: ISøknadSpørsmål<ISODateString | ''>;
    månedligBeløp: ISøknadSpørsmål<string>;
}

export interface IBarnehageplassPeriode {
    barnehageplassPeriodeBeskrivelse: ISøknadSpørsmål<EBarnehageplassPeriodeBeskrivelse>;
    barnehageplassUtlandet: ISøknadSpørsmål<ESvar>;
    barnehageplassLand: ISøknadSpørsmål<Alpha3Code | ''>;
    offentligStøtte: ISøknadSpørsmål<ESvar | null>;
    antallTimer: ISøknadSpørsmål<string>;
    startetIBarnehagen: ISøknadSpørsmål<ISODateString>;
    slutterIBarnehagen: ISøknadSpørsmål<DatoMedUkjent>;
}

export interface IUsePeriodeSkjemaVerdi<T> extends UseSkjemaVerdi<T, string> {
    validerFelterOgVisFeilmelding: () => boolean;
}
