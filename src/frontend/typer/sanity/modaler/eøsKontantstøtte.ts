import { LocaleRecordBlock } from '../../common';

export interface IEøsKontantstøtteTekstinnhold {
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
    knapper: {
        fjern: LocaleRecordBlock;
        leggTil: LocaleRecordBlock;
    };
    land: {
        farEosYtelseFraLand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
        fikkEosYtelseFraLand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
    };
    tittel: LocaleRecordBlock;
}
