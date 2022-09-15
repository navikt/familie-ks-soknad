import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';

export interface IForsideTekstinnhold {
    bekreftelsesboksTittel: LocaleRecordString;
    bekreftelsesboksBroedtekst: LocaleRecordBlock;
    bekreftelsesboksErklaering: LocaleRecordString;
    bekreftelsesboksFeilmelding: LocaleRecordString;
    punktliste: LocaleRecordBlock;
    veilederhilsen: LocaleRecordBlock;
    soeknadstittel: LocaleRecordBlock;
    personopplysningslenke: LocaleRecordBlock;
    mellomlagretAlert: LocaleRecordBlock;
}
