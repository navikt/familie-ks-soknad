import { PersonType } from '../../../typer/personType';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import {
    landFeilmeldingSpråkIdsSøker,
    landLabelSpråkIdsAndreForelder,
    landLabelSpråkIdsBarn,
    landLabelSpråkIdsSøker,
    årsakSpråkIdsAndreForelder,
    årsakSpråkIdsBarn,
    årsakSpråkIdsSøker,
} from './spørsmål';

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

export const årsakLabelSpråkId = (personType: PersonType): string => {
    switch (personType) {
        case PersonType.søker: {
            return 'modal.beskriveopphold.spm';
        }
        case PersonType.barn: {
            return 'ombarnet.beskriveopphold.spm';
        }
        case PersonType.andreForelder:
        default: {
            return 'todo.andreforelder.utenlandsopphold';
        }
    }
};

export const årsakSpråkId = (
    årsak: EUtenlandsoppholdÅrsak | '',
    personType: PersonType
): string => {
    switch (personType) {
        case PersonType.søker: {
            return årsakSpråkIdsSøker[årsak];
        }
        case PersonType.barn: {
            return årsakSpråkIdsBarn[årsak];
        }
        case PersonType.andreForelder:
        default: {
            return årsakSpråkIdsAndreForelder[årsak];
        }
    }
};

export const landLabelSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', personType: PersonType) => {
    switch (personType) {
        case PersonType.søker: {
            return landLabelSpråkIdsSøker[årsak];
        }
        case PersonType.barn: {
            return landLabelSpråkIdsBarn[årsak];
        }
        case PersonType.andreForelder:
        default: {
            return landLabelSpråkIdsAndreForelder[årsak];
        }
    }
};

export const landFeilmeldingSpråkId = (
    årsak: EUtenlandsoppholdÅrsak | '',
    personType: PersonType
) => {
    switch (personType) {
        case PersonType.søker: {
            return landFeilmeldingSpråkIdsSøker[årsak];
        }
        case PersonType.barn: {
            return landFeilmeldingSpråkIdsBarn[årsak];
        }
        case PersonType.andreForelder:
        default: {
            return landFeilmeldingSpråkIdsAndreForelder[årsak];
        }
    }
};

export const landFeilmeldingSpråkIdsBarn: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]:
        'ombarnet.hvilketlandflyttetfra.feilmelding',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]:
        'ombarnet.hvilketlandflyttettil.feilmelding',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'ombarnet.hvilketlandoppholdti.feilmelding',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]:
        'ombarnet.hvilketlandoppholderi.feilmelding',
};

export const landFeilmeldingSpråkIdsAndreForelder: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'todo.andreforelder.utenlandsopphold',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'todo.andreforelder.utenlandsopphold',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]: 'todo.andreforelder.utenlandsopphold',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'todo.andreforelder.utenlandsopphold',
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

export const fraDatoLabelSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', personType: PersonType) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return personType === PersonType.barn
                ? 'ombarnet.nårflyttetfranorge.spm'
                : personType === PersonType.søker
                ? 'modal.nårflyttetfra.spm'
                : 'todo.andreforelder.utenlandsopphold';
        default:
            return 'felles.nårstartetoppholdet.spm';
    }
};

export const tilDatoLabelSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', personType: PersonType) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return personType === PersonType.barn
                ? 'ombarnet.nårflyttettilnorge.spm'
                : personType === PersonType.søker
                ? 'modal.nårflyttettilnorge.spm'
                : 'todo.andreforelder.utenlandsopphold';
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return 'felles.nåravsluttetoppholdet.spm';
        default:
            return 'felles.nåravsluttesoppholdet.spm';
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
