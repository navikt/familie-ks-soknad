import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IOmDegTekstinnhold {
    omDegTittel: LocaleRecordBlock;
    personopplysningerAlert: LocaleRecordBlock;
    adresse: LocaleRecordString;
    idnummer: LocaleRecordString;
    sivilstatus: LocaleRecordString;
    statsborgerskap: LocaleRecordString;
    borPaaAdressen: ISanitySpørsmålDokument;
    oppholdtDegSammenhengende: ISanitySpørsmålDokument;
    medlemAvFolketrygden: ISanitySpørsmålDokument;
    planleggerAaBoSammenhengende: ISanitySpørsmålDokument;
    ikkeRegistrertAdresse: LocaleRecordString;
    ukjentAdresse: LocaleRecordString;
}
