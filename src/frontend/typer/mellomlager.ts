import { ISøknad } from './søknad';
import { LocaleType } from '../../common/typer/localeType';

export interface IMellomlagretKontantstøtte {
    søknad: ISøknad;
    sisteUtfylteStegIndex: number;
    sistePåbegynteStegIndex: number | undefined;
    modellVersjon: number;
    locale: LocaleType;
    datoSistLagret: string;
}
