import { ISøknad } from './søknad';
import { LocaleType } from '../../common/typer/locale';

export interface IMellomlagretKontantstøtte {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    sistePåbegynteStegIndex: number | undefined;
    modellVersjon: number;
    locale: LocaleType;
    datoSistLagret: string;
}
