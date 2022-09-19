import { LocaleRecordBlock } from '../../common';

export interface IPensjonsperiodeTekstinnhold {
    //todo: oppdater riktig struktur
    dato: {
        farStartdato: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
        fikkStartdato: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
        narAvsluttetDato: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
    };
    farPensjonNa: {
        feilmelding: LocaleRecordBlock;
        sporsmal: LocaleRecordBlock;
    };
    flerePerioderSporsmal: LocaleRecordBlock;
    land: {
        farPensjonFraLand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
        fikkPensjonFraLand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
    };
}
