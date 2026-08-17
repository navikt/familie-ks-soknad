import type { LocaleType } from '../../common/typer/locale';

import type { ISøknad } from './søknad';

export interface IMellomlagretKontantstøtte {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    sistePåbegynteStegIndex: number | undefined;
    modellVersjon: number;
    locale: LocaleType;
    datoSistLagret: string;
}
