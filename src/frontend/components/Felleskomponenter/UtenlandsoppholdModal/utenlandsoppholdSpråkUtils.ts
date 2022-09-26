import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { PersonType } from '../../../typer/personType';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { landFeilmeldingSpråkIdsSøker } from './spørsmål';

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

export const hentLandSpørsmålForÅrsak = (
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
