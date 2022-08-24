import { LocaleRecordBlock, LocaleRecordString } from '../../common';

export interface IBarnehageplassTekstinnhold {
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
        SluttetIBarnehagenDato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
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
    knapper: {
        fjern: LocaleRecordBlock;
        leggTil: LocaleRecordBlock;
    };
    offentligStotte: {
        feilmelding: LocaleRecordString;
        sporsmal: LocaleRecordString;
    };
    tittel: LocaleRecordBlock;

    utlandet: {
        barnehageUtlandet: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        hvilketLand: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
    };
}
