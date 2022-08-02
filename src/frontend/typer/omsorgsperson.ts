import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput } from './common';
import { Slektsforhold } from './kontrakt/generelle';
import {
    IArbeidsperiode,
    IEøsBarnetrygdsperiode,
    IPensjonsperiode,
    IUtbetalingsperiode,
} from './perioder';
import { ISøknadSpørsmål } from './spørsmål';

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
    barnetrygdFraEøs: ISøknadSpørsmål<ESvar | null>;
    eøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[]; //todo: rename
    pågåendeSøknadFraAnnetEøsLand: ISøknadSpørsmål<ESvar | null>;
    pågåendeSøknadHvilketLand: ISøknadSpørsmål<Alpha3Code | ''>;
}
