import { useLocale } from '@hooks/useLocale';
import type { FlettefeltVerdier } from '../../common/typer/kontrakt/generelle';
import type { LocaleRecordBlock, LocaleRecordString, LocaleType } from '../../common/typer/locale';
import { plainTekstHof } from '../utils/sanity';
import { useTranslateFlettefelt } from './useTranslateFlettefelt';

type Translate = (
    localeRecord: LocaleRecordBlock | LocaleRecordString | undefined,
    flettefelter?: FlettefeltVerdier,
    spesifikkLocale?: LocaleType
) => string;

export function useTranslate(): Translate {
    const locale = useLocale();
    const translateFlettefelt = useTranslateFlettefelt();

    return plainTekstHof(translateFlettefelt, locale);
}
