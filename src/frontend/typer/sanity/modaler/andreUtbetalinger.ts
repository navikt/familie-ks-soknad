import { LocaleRecordBlock, LocaleRecordString } from '../../common';

export interface IAndreUtbetalingerTekstinnhold {
    dato: {
        startdato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        fremtidSluttdato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        fortidSluttdato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        ukjentSluttdato: { label: LocaleRecordString };
    };
    flerePerioderSporsmal: LocaleRecordString;
    knapper: {
        fjern: LocaleRecordBlock;
        leggTil: LocaleRecordBlock;
    };
    land: {
        feilmelding: LocaleRecordBlock;
        sporsmal: LocaleRecordBlock;
    };
    mottarNa: {
        feilmelding: LocaleRecordBlock;
        sporsmal: LocaleRecordBlock;
    };
    tittel: LocaleRecordBlock;
}
