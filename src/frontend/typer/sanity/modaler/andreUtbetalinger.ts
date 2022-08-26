import { LocaleRecordBlock, LocaleRecordString } from '../../common';
import { IFellesModalFelterTekstinnhold } from './fellesModalFelter';

export interface IAndreUtbetalingerTekstinnhold extends IFellesModalFelterTekstinnhold {
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
