import type { ESvar } from '@navikt/familie-form-elements';
import type { Alpha3Code } from 'i18n-iso-countries';

import type { Slektsforhold } from '../../common/typer/kontrakt/generelle';

import type { AlternativtSvarForInput } from './common';
import type { IArbeidsperiode, IEøsKontantstøttePeriode, IPensjonsperiode, IUtbetalingsperiode } from './perioder';
import type { ISøknadSpørsmål } from './spørsmål';

export interface IOmsorgsperson {
    navn: ISøknadSpørsmål<string>;
    slektsforhold: ISøknadSpørsmål<Slektsforhold | ''>;
    slektsforholdSpesifisering: ISøknadSpørsmål<string>;
    idNummer: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    adresse: ISøknadSpørsmål<string>;
    arbeidUtland: ISøknadSpørsmål<ESvar | null>;
    arbeidsperioderUtland: IArbeidsperiode[];
    arbeidNorge: ISøknadSpørsmål<ESvar | null>;
    arbeidsperioderNorge: IArbeidsperiode[];
    pensjonUtland: ISøknadSpørsmål<ESvar | null>;
    pensjonsperioderUtland: IPensjonsperiode[];
    pensjonNorge: ISøknadSpørsmål<ESvar | null>;
    pensjonsperioderNorge: IPensjonsperiode[];
    andreUtbetalinger: ISøknadSpørsmål<ESvar | null>;
    andreUtbetalingsperioder: IUtbetalingsperiode[];
    kontantstøtteFraEøs: ISøknadSpørsmål<ESvar | null>;
    eøsKontantstøttePerioder: IEøsKontantstøttePeriode[];
    pågåendeSøknadFraAnnetEøsLand: ISøknadSpørsmål<ESvar | null>;
    pågåendeSøknadHvilketLand: ISøknadSpørsmål<Alpha3Code | ''>;
}
