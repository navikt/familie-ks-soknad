import { LocaleRecordBlock } from '../../common';
import { IFellesModalFelterTekstinnhold } from './fellesModalFelter';

export interface IEøsKontantstøtteTekstinnhold extends IFellesModalFelterTekstinnhold {
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
