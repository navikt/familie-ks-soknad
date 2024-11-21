import { LocaleType } from './common';
import { ISøknad } from './søknad';

export interface IMellomlagretKontantstøtte {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    modellVersjon: number;
    locale: LocaleType;
}
