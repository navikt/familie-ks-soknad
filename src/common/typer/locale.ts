import { PortableTextBlock } from '@portabletext/types';

export enum LocaleType {
    en = 'en',
    nb = 'nb',
    nn = 'nn',
}

export type LocaleRecordString = Record<LocaleType, string> & {
    api_navn: string;
    [key: string]: unknown;
};

export type LocaleRecordBlock = Record<LocaleType, PortableTextBlock[]> & {
    api_navn: string;
    [key: string]: unknown;
};
