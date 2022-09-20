import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { SpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IOmDegTekstinnhold {
    omDegTittel: LocaleRecordBlock;
    personopplysningerAlert: LocaleRecordBlock;
    adresse: LocaleRecordString;
    idnummer: LocaleRecordString;
    sivilstatus: LocaleRecordString;
    statsborgerskap: LocaleRecordString;
    borDuPaDenneAdressen: {
        sporsmal: LocaleRecordString;
        feilmelding: LocaleRecordString;
        alert: {
            alertTekst: LocaleRecordBlock;
            alertVariant: LocaleRecordBlock;
        };
    };
    sammenhengendeNorgeSoker: {
        sporsmal: LocaleRecordString;
        feilmelding: LocaleRecordString;
        beskrivelse: LocaleRecordString;
    };
    sammenhengendeNorgeMerEnnTolvManeder: {
        sporsmal: LocaleRecordString;
        feilmelding: LocaleRecordString;
        alert: {
            alertTekst: LocaleRecordBlock;
            alertVariant: LocaleRecordBlock;
        };
    };
    medlemFolketrygd: SpørsmålDokument;
}
