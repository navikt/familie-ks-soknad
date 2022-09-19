import { LocaleRecordBlock } from '../../common';

export interface IEøsYtelseTekstinnhold {
    //todo: oppdater riktig struktur
    belop: {
        feilmelding: LocaleRecordBlock;
        sporsmal: LocaleRecordBlock;
    };
    dato: {
        farStartdato: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
        narAvsluttetDato: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
    };
    farEosYtelseNa: {
        feilmelding: LocaleRecordBlock;
        sporsmal: LocaleRecordBlock;
    };
    flerePerioderSporsmal: LocaleRecordBlock;
    land: {
        farEosYtelseFraLand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
        fikkEosYtelseFraLand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
    };
}
