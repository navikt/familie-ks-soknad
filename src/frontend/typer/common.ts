import { ESvar, ISODateString } from '@navikt/familie-form-elements';

export interface IPar {
    id: number;
    navn: string;
}

export interface INøkkelPar {
    [key: string]: IPar;
}

export type ESvarMedUbesvart = ESvar | null;

export enum AlternativtSvarForInput {
    UKJENT = 'UKJENT',
    ANNEN_FORELDER = 'ANNEN_FORELDER',
}

export type DatoMedUkjent = ISODateString | AlternativtSvarForInput.UKJENT;
export type BarnetsId = string;

export type TomString = '';
export const tomString: TomString = '';
