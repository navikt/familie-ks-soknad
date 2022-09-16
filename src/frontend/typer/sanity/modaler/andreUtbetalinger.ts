import { LocaleRecordBlock, LocaleRecordString } from '../../common';

export interface IAndreUtbetalingerTekstinnhold {
    //todo: oppdater riktig struktur
    dato: {
        startdato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        fremtidSluttdato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        fortidSluttdato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        ukjentSluttdato: { label: LocaleRecordString };
    };
    flerePerioderSporsmal: LocaleRecordString;
    land: {
        feilmelding: LocaleRecordBlock;
        sporsmal: LocaleRecordBlock;
    };
    mottarNa: {
        feilmelding: LocaleRecordBlock;
        sporsmal: LocaleRecordBlock;
    };
}
