import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';

export interface IOmDegTekstinnhold {
    omDegTittel: {
        tittel: LocaleRecordBlock;
    };
    personopplysninger: {
        adresse: LocaleRecordString;
        alert: {
            alertTekst: LocaleRecordBlock;
            alertVariant: LocaleRecordBlock;
        };
        ident: LocaleRecordString;
        sivilstatus: LocaleRecordString;
        statsborgerskap: LocaleRecordString;
    };
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
    medlemFolketrygden: {
        sporsmal: LocaleRecordString;
        feilmelding: LocaleRecordString;
        alert: {
            alertTekst: LocaleRecordBlock;
            alertVariant: LocaleRecordBlock;
        };
    };
}
