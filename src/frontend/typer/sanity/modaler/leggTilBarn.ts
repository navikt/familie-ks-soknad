import { LocaleRecordString } from '../../common';

export interface ILeggTilBarnTekstinnhold {
    //todo: oppdater riktig struktur
    barnetsNavn: {
        etternavn: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        fornavn: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        ikkeBestemtCheckboxLabel: LocaleRecordString;
        tittel: LocaleRecordString;
    };
    erBarnFodt: {
        alert: { alertTekst: LocaleRecordString; alertVariant: LocaleRecordString };
        feilmeldingIkkeFodt: LocaleRecordString;
        feilmeldingUbesvart: LocaleRecordString;
        sporsmal: LocaleRecordString;
    };
    ident: {
        feilmelding: LocaleRecordString;
        sporsmal: LocaleRecordString;
        ikkeFattIdentCheckboxLabel: LocaleRecordString;
        ikkeFattIdentAlert: LocaleRecordString;
    };
}
