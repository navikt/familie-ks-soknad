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
    medlemFolketrygden: {
        sporsmal: LocaleRecordString;
        feilmelding: LocaleRecordString;
        alert: {
            alertTekst: LocaleRecordBlock;
            alertVariant: LocaleRecordBlock;
        };
    };
    borDuPaDenneAdressen: {
        sporsmal: LocaleRecordString;
        feilmelding: LocaleRecordString;
        alert: {
            alertTekst: LocaleRecordString;
            alertVariant: LocaleRecordBlock;
        };
    };
}
