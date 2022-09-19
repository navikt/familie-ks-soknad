import { LocaleRecordString } from '../../common';

export interface IBarnehageplassTekstinnhold {
    //todo: oppdater riktig struktur
    antallTimer: {
        feilmelding: LocaleRecordString;
        sporsmal: LocaleRecordString;
    };
    beskrivelse: {
        feilmelding: LocaleRecordString;
        sporsmal: LocaleRecordString;
        valgalternativer: {
            barnehageplassFremtiden: LocaleRecordString;
            barnehageplassNa: LocaleRecordString;
            barnehageplassTidligere: LocaleRecordString;
        };
    };
    dato: {
        sluttetIBarnehagenDato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        slutterIBarnehagenDato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        starterIBarnehagenDato: {
            feilmelding: LocaleRecordString;
            sporsmal: LocaleRecordString;
        };
        startetIBarnehagenDato: {
            feilmelding: LocaleRecordString;
            sporsmal: LocaleRecordString;
        };
        ukjentSluttdato: { label: LocaleRecordString };
    };
    flerePerioderSporsmal: LocaleRecordString;
    offentligStotte: {
        feilmelding: LocaleRecordString;
        sporsmal: LocaleRecordString;
    };
    utlandet: {
        barnehageUtlandet: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        hvilketLand: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
    };
}
