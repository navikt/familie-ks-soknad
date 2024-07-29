import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';

export interface IForsideTekstinnhold {
    bekreftelsesboksTittel: LocaleRecordString;
    bekreftelsesboksBroedtekst: LocaleRecordBlock;
    bekreftelsesboksErklaering: LocaleRecordString;
    bekreftelsesboksFeilmelding: LocaleRecordString;
    punktliste: LocaleRecordBlock;
    veilederHei: LocaleRecordBlock;
    veilederhilsen: LocaleRecordBlock;
    soeknadstittel: LocaleRecordBlock;
    personopplysningslenke: LocaleRecordBlock;
    mellomlagretAlert: LocaleRecordBlock;
    foerDuSoekerTittel: LocaleRecordBlock;
    foerDuSoeker: LocaleRecordBlock;
    informasjonOmPlikterTittel: LocaleRecordBlock;
    informasjonOmPlikter: LocaleRecordBlock;
    informasjonOmPersonopplysningerTittel: LocaleRecordBlock;
    informasjonOmPersonopplysninger: LocaleRecordBlock;
}
