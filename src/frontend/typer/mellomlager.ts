import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknad } from './søknad';

export interface IMellomlagretKontantstøtte {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    modellVersjon: number;
    locale: LocaleType;
}
