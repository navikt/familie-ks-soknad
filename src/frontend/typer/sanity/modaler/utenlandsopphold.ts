import { LocaleRecordBlock, LocaleRecordString } from '../../common';

export interface IUtenlandsoppholdTekstinnhold {
    arsak: {
        feilmelding: LocaleRecordString;
        sporsmal: LocaleRecordString;
        valgalternativer: {
            oppholdUtenforNorgeNa: LocaleRecordString;
            oppholdUtenforNorgeTidligere: LocaleRecordString;
            permanentFraNorge: LocaleRecordString;
            permanentTilNorge: LocaleRecordString;
        };
    };
    dato: {
        flyttetFraNorgeDato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        flyttetTilNorgeDato: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        oppholdUtlandFortidSluttdato: {
            feilmelding: LocaleRecordString;
            sporsmal: LocaleRecordString;
        };
        oppholdUtlandFramtidSluttdato: {
            feilmelding: LocaleRecordString;
            sporsmal: LocaleRecordString;
        };
        oppholdUtlandStartdato: {
            feilmelding: LocaleRecordString;
            sporsmal: LocaleRecordString;
        };
        ukjentSluttdato: { label: LocaleRecordString };
    };
    land: {
        landFlyttetFra: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        landFlyttetTil: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
        landNavaerendeOpphold: {
            feilmelding: LocaleRecordString;
            sporsmal: LocaleRecordString;
        };
        landTidligereOpphold: { feilmelding: LocaleRecordString; sporsmal: LocaleRecordString };
    };
    flerePerioderSporsmal: LocaleRecordString;
    knapper: {
        fjern: LocaleRecordString;
        leggTil: LocaleRecordString;
    };
    tittel: LocaleRecordBlock;
}
