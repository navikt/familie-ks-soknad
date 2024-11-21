import { PortableTextBlock } from '@portabletext/types';

export type ISODateString = string;

export enum AlternativtSvarForInput {
    UKJENT = 'UKJENT',
    ANNEN_FORELDER = 'ANNEN_FORELDER',
}

export type DatoMedUkjent = ISODateString | AlternativtSvarForInput.UKJENT;
export type BarnetsId = string;

export type TomString = '';
export const tomString: TomString = '';

export type LocaleRecordString = Record<LocaleType, string> & {
    api_navn: string;
    [key: string]: unknown;
};

export type LocaleRecordBlock = Record<LocaleType, PortableTextBlock[]> & {
    api_navn: string;
    [key: string]: unknown;
};

export enum Typografi {
    StegHeadingH1 = 'StegHeadingH1',
    ModalHeadingH1 = 'ModalHeadingH1',
    ForsideHeadingH1 = 'ForsideHeadingH1',
    Ingress = 'Ingress',
    BodyLong = 'BodyLong',
    BodyShort = 'BodyShort',
    Label = 'Label',
    Detail = 'Detail',
    HeadingH2 = 'HeadingH2',
    HeadingH3 = 'HeadingH3',
}

export enum LocaleType {
    en = 'en',
    nb = 'nb',
    nn = 'nn',
}

export const erGyldigSpråk = (språk: string): språk is LocaleType =>
    Object.values(LocaleType).includes(språk as LocaleType);
