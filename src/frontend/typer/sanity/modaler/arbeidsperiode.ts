import { LocaleRecordBlock, LocaleRecordString } from '../../common';
import { IFellesModalFelterTekstinnhold } from './fellesModalFelter';

export interface IArbeidsperiodeTekstinnhold extends IFellesModalFelterTekstinnhold {
    arbeidsgiver: {
        feilmelding: LocaleRecordString;
        sporsmal: LocaleRecordString;
    };

    dato: {
        fortidSluttdato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        fremtidSluttdato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        startdato: {
            feilmelding: LocaleRecordString;
            sporsmal: LocaleRecordString;
        };
        ukjentSluttdato: { label: LocaleRecordString };
    };
    flerePerioderSporsmal: LocaleRecordBlock;
    land: {
        arbeiderILand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
        arbeidetILand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
    };
    periodeAvsluttet: {
        feilmelding: LocaleRecordString;
        sporsmal: LocaleRecordString;
    };
}
