import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput, BarnetsId } from './common';
import { ESivilstand, IAdresse } from './kontrakt/generelle';
import { IArbeidsperiode, IPensjonsperiode, IUtbetalingsperiode, IUtenlandsperiode } from './perioder';
import { ISøknadSpørsmål } from './spørsmål';

export interface IPerson {
    ident: string;
    adressebeskyttelse: boolean;
}

export interface IBarnRespons extends IPerson {
    navn: string | null;
    borMedSøker: boolean;
    fødselsdato: string | undefined;
}

export interface ISøkerRespons extends IPerson {
    navn: string;
    barn: IBarnRespons[];
    statsborgerskap: { landkode: Alpha3Code }[];
    adresse: IAdresse | null;
    sivilstand: { type: ESivilstand };
}

export interface IBarn extends IPerson {
    id: BarnetsId;
    navn: string;
    borMedSøker: boolean | undefined;
    alder: string | null;
    erUnder11Mnd: boolean;
}

export interface IIdNummer {
    land: Alpha3Code;
    idnummer: string | AlternativtSvarForInput.UKJENT;
}

export interface ISøker extends Omit<ISøkerRespons, 'barn'> {
    // Steg: Om Deg
    barn: IBarn[];
    triggetEøs: boolean;
    borPåRegistrertAdresse: ISøknadSpørsmål<ESvar | null>;
    værtINorgeITolvMåneder: ISøknadSpørsmål<ESvar | null>;
    planleggerÅBoINorgeTolvMnd: ISøknadSpørsmål<ESvar | null>;
    yrkesaktivFemÅr: ISøknadSpørsmål<ESvar | null>;

    // Steg: Din Livssituasjon
    erAsylsøker: ISøknadSpørsmål<ESvar | null>;
    arbeidIUtlandet: ISøknadSpørsmål<ESvar | null>;
    arbeidsperioderUtland: IArbeidsperiode[];
    utenlandsoppholdUtenArbeid: ISøknadSpørsmål<ESvar | null>;
    utenlandsperioder: IUtenlandsperiode[];
    mottarUtenlandspensjon: ISøknadSpørsmål<ESvar | null>;
    pensjonsperioderUtland: IPensjonsperiode[];

    // Steg: EØS-steg
    arbeidINorge: ISøknadSpørsmål<ESvar | null>;
    arbeidsperioderNorge: IArbeidsperiode[];
    pensjonNorge: ISøknadSpørsmål<ESvar | null>;
    pensjonsperioderNorge: IPensjonsperiode[];
    andreUtbetalinger: ISøknadSpørsmål<ESvar | null>;
    andreUtbetalingsperioder: IUtbetalingsperiode[];
    idNummer: IIdNummer[];
    adresseISøkeperiode: ISøknadSpørsmål<string>;
}
