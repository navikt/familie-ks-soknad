import { LocaleRecordBlock, LocaleRecordString } from '../../common';

export interface IArbeidsperiodeTekstinnhold {
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
    knapper: {
        fjern: LocaleRecordBlock;
        leggTil: LocaleRecordBlock;
    };
    land: {
        arbeiderILand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
        arbeidetILand: { feilmelding: LocaleRecordBlock; sporsmal: LocaleRecordBlock };
    };
    periodeAvsluttet: {
        feilmelding: LocaleRecordString;
        sporsmal: LocaleRecordString;
    };
    tittel: LocaleRecordBlock;
}
