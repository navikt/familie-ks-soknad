import { LocaleRecordBlock } from '../../common';

export interface IPensjonsperiodeTekstinnhold {
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
    knapper: {
        fjern: LocaleRecordBlock;
        leggTil: LocaleRecordBlock;
    };
    land: {
        farPensjonFraLand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
        fikkPensjonFraLand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
    };
    tittel: LocaleRecordBlock;
}
