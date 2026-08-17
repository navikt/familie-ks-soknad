import type { ISODateString } from '../../common/typer/ISODateString';
import { LocaleType } from '../../common/typer/locale';

export enum AlternativtSvarForInput {
    UKJENT = 'UKJENT',
    ANNEN_FORELDER = 'ANNEN_FORELDER',
    BARNEHAGEPLASS_HELTID = 'BARNEHAGEPLASS_HELTID',
    BARNEHAGEPLASS_DELTID = 'BARNEHAGEPLASS_DELTID',
}

export type DatoMedUkjent = ISODateString | AlternativtSvarForInput.UKJENT;
export type BarnetsId = string;

export type TomString = '';
export const tomString: TomString = '';

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

export const erGyldigSpråk = (språk: string): språk is LocaleType =>
    Object.values(LocaleType).includes(språk as LocaleType);
