import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';

export interface IForsideTekstinnhold {
    bekreftelsesBoks: {
        erklaering: LocaleRecordString;
    };
    punktliste: {
        innhold: LocaleRecordBlock;
    };
}
