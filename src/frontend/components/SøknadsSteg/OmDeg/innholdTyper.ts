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
        ytelse: [];
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
        alert: {
            alertTekst: LocaleRecordString;
            alertVariant: LocaleRecordBlock;
        };
        sporsmal: LocaleRecordString;
        feilmelding: LocaleRecordString;
    };
}
