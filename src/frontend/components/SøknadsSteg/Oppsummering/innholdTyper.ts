import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';

export interface IOppsummeringTekstinnhold {
    oppsummeringTittel: LocaleRecordBlock;
    oppsummeringGuide: LocaleRecordBlock;
    lesNoeye: LocaleRecordString;
    endreSvarLenkeTekst: LocaleRecordString;
}
