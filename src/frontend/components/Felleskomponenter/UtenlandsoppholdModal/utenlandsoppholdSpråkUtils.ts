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
        case PersonType.Søker: {
            return 'modal.beskriveopphold.feilmelding';
        }
        case PersonType.Barn: {
            return 'ombarnet.beskriveopphold.feilmelding';
        }
        case PersonType.AndreForelder:
        default: {
            return 'todo.andreforelder.utenlandsopphold';
        }
    }
};

export const årsakLabelSpråkId = (personType: PersonType): string => {
    switch (personType) {
        case PersonType.Søker: {
            return 'modal.beskriveopphold.spm';
        }
        case PersonType.Barn: {
            return 'ombarnet.beskriveopphold.spm';
        }
        case PersonType.AndreForelder:
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
        case PersonType.Søker: {
            return årsakSpråkIdsSøker[årsak];
        }
        case PersonType.Barn: {
            return årsakSpråkIdsBarn[årsak];
        }
        case PersonType.AndreForelder:
        default: {
            return årsakSpråkIdsAndreForelder[årsak];
        }
    }
};

export const landLabelSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', personType: PersonType) => {
    switch (personType) {
        case PersonType.Søker: {
            return landLabelSpråkIdsSøker[årsak];
        }
        case PersonType.Barn: {
            return landLabelSpråkIdsBarn[årsak];
        }
        case PersonType.AndreForelder:
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
        case PersonType.Søker: {
            return landFeilmeldingSpråkIdsSøker[årsak];
        }
        case PersonType.Barn: {
            return landFeilmeldingSpråkIdsBarn[årsak];
        }
        case PersonType.AndreForelder:
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
            return personType === PersonType.Barn
                ? 'ombarnet.nårflyttetfranorge.feilmelding'
                : personType === PersonType.Søker
                ? 'modal.nårflyttetfra.feilmelding'
                : 'todo.andreforelder.utenlandsopphold';
        default:
            return 'felles.nårstartetoppholdet.feilmelding';
    }
};

export const fraDatoLabelSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', personType: PersonType) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return personType === PersonType.Barn
                ? 'ombarnet.nårflyttetfranorge.spm'
                : personType === PersonType.Søker
                ? 'modal.nårflyttetfra.spm'
                : 'todo.andreforelder.utenlandsopphold';
        default:
            return 'felles.nårstartetoppholdet.spm';
    }
};

export const tilDatoLabelSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', personType: PersonType) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return personType === PersonType.Barn
                ? 'ombarnet.nårflyttettilnorge.spm'
                : personType === PersonType.Søker
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
            return personType === PersonType.Barn
                ? 'ombarnet.nårflyttettilnorge.feilmelding'
                : personType === PersonType.Søker
                ? 'modal.nårflyttettilnorge.feilmelding'
                : 'todo.andreforelder.utenlandsopphold';
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return 'felles.nåravsluttetoppholdet.feilmelding';
        default:
            return 'felles.nåravsluttesoppholdet.feilmelding';
    }
};
