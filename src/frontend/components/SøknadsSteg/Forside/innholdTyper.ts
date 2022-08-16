import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';

export interface IForsideTekstinnhold {
    bekreftelsesboks: {
        tittel: LocaleRecordString;
        brodtekst: LocaleRecordBlock;
        erklaering: LocaleRecordString;
        feilmelding: LocaleRecordString;
    };
    punktliste: {
        innhold: LocaleRecordBlock;
    };
}
