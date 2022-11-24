import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IOmDegTekstinnhold {
    omDegTittel: LocaleRecordBlock;
    personopplysningerAlert: LocaleRecordBlock;
    navn: LocaleRecordString;
    adresse: LocaleRecordString;
    ident: LocaleRecordString;
    sivilstatus: LocaleRecordString;
    statsborgerskap: LocaleRecordString;
    borPaaAdressen: ISanitySpørsmålDokument;
    oppholdtDegSammenhengende: ISanitySpørsmålDokument;
    medlemAvFolketrygden: ISanitySpørsmålDokument;
    planleggerAaBoSammenhengende: ISanitySpørsmålDokument;
    ikkeRegistrertAdresse: LocaleRecordString;
    ukjentAdresse: LocaleRecordString;
    soekerAdressesperre: LocaleRecordString;
}
