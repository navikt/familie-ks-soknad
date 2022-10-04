import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { PersonType } from '../../../typer/personType';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';

export const årsakFeilmeldingSpråkId = (personType: PersonType): string => {
    switch (personType) {
        case PersonType.søker: {
            return 'modal.beskriveopphold.feilmelding';
        }
        case PersonType.barn: {
            return 'ombarnet.beskriveopphold.feilmelding';
        }
        case PersonType.andreForelder:
        default: {
            return 'todo.andreforelder.utenlandsopphold';
        }
    }
};

export const utenlandsoppholdÅrsakTilTekst = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
): LocaleRecordString => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE: {
            return tekster.valgalternativPermanentIUtland;
        }
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE: {
            return tekster.valgalternativPermanentINorge;
        }
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return tekster.valgalternativOppholdUtenforNorgeTidligere;
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
            return tekster.valgalternativOppholdUtenforNorgeNaa;
        default: {
            return tekster.valgalternativPlaceholder;
        }
    }
};

export const hentLandSpørsmål = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
): LocaleRecordBlock => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return tekster.landFlyttetTil.sporsmal;
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return tekster.landFlyttetFra.sporsmal;
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return tekster.tidligereOpphold.sporsmal;
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
        default: {
            return tekster.naavaerendeOpphold.sporsmal;
        }
    }
};

export const landFeilmeldingTekst = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
): LocaleRecordBlock => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return tekster.landFlyttetFra.feilmelding;
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return tekster.landFlyttetTil.feilmelding;
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return tekster.tidligereOpphold.feilmelding;
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
        default: {
            return tekster.naavaerendeOpphold.feilmelding;
        }
    }
};

export const fraDatoFeilmeldingSpråkId = (
    årsak: EUtenlandsoppholdÅrsak | '',
    personType: PersonType
) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return personType === PersonType.barn
                ? 'ombarnet.nårflyttetfranorge.feilmelding'
                : personType === PersonType.søker
                ? 'modal.nårflyttetfra.feilmelding'
                : 'todo.andreforelder.utenlandsopphold';
        default:
            return 'felles.nårstartetoppholdet.feilmelding';
    }
};

export const hentFraDatoSpørsmål = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
): LocaleRecordBlock => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return tekster.flyttetFraNorgeDato.sporsmal;
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
        default: {
            return tekster.startdato.sporsmal;
        }
    }
};

export const hentTilDatoSpørsmål = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
): LocaleRecordBlock => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return tekster.flyttetTilNorgeDato.sporsmal;
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return tekster.sluttdatoFortid.sporsmal;
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
        default: {
            return tekster.sluttdatoFremtid.sporsmal;
        }
    }
};

export const tilDatoFeilmeldingSpråkId = (
    årsak: EUtenlandsoppholdÅrsak | '',
    personType: PersonType
) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return personType === PersonType.barn
                ? 'ombarnet.nårflyttettilnorge.feilmelding'
                : personType === PersonType.søker
                ? 'modal.nårflyttettilnorge.feilmelding'
                : 'todo.andreforelder.utenlandsopphold';
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return 'felles.nåravsluttetoppholdet.feilmelding';
        default:
            return 'felles.nåravsluttesoppholdet.feilmelding';
    }
};
