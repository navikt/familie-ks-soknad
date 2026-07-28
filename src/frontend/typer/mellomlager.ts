import { LocaleType } from '../../common/typer/locale';

import { ISøknad } from './søknad';

export interface IMellomlagretKontantstøtte {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    sistePåbegynteStegIndex: number | undefined;
    modellVersjon: number;
    locale: LocaleType;
    datoSistLagret: string;
}
