import { Alpha3Code, alpha3ToAlpha2, getName } from 'i18n-iso-countries';

import { LocaleType } from '@navikt/familie-sprakvelger';

import * as engelsk from '../assets/lang/en.json' assert { type: 'json' };
import * as bokmål from '../assets/lang/nb.json' assert { type: 'json' };
import * as nynorsk from '../assets/lang/nn.json' assert { type: 'json' };
import { IEøsForBarnTekstinnhold } from '../components/SøknadsSteg/EøsSteg/Barn/innholdTyper';
import { IVelgBarnTekstinnhold } from '../components/SøknadsSteg/VelgBarn/innholdTyper';
import { AlternativtSvarForInput } from '../typer/common';
import { ESivilstand, Slektsforhold } from '../typer/kontrakt/generelle';
import { IBarn } from '../typer/person';
import { ESanitySivilstandApiKey } from '../typer/sanity/sanity';

export const hentSlektsforhold = (
    slektsforhold: Slektsforhold,
    tekster: IEøsForBarnTekstinnhold
) => {
    switch (slektsforhold) {
        case Slektsforhold.FORELDER:
            return tekster.valgalternativForelder;
        case Slektsforhold.BESTEFORELDER:
            return tekster.valgalternativBesteforelder;
        case Slektsforhold.ONKEL_ELLER_TANTE:
            return tekster.valgalternativOnkelTante;
        case Slektsforhold.ANNEN_FAMILIERELASJON:
            return tekster.valgalternativAnnenFamilierelasjon;
        case Slektsforhold.ANNEN_RELASJON:
            return tekster.valgalternativAnnenRelasjon;
    }
};

export const landkodeTilSpråk = (landkode: Alpha3Code | '', locale: string): string => {
    return landkode ? getName(alpha3ToAlpha2(landkode), locale) : AlternativtSvarForInput.UKJENT;
};

const stripSpråkfil = (språkfilInnhold: Record<string, string>): Record<string, string> => {
    const språkEntries = Object.entries(språkfilInnhold);
    // Vi får med en default import her som vi må fjerne før vi kan mappe over entryene
    språkEntries.pop();
    return Object.fromEntries(språkEntries.map(([key, value]) => [key, value.trim()]));
};

const texts: Record<LocaleType, Record<string, string>> = {
    [LocaleType.nb]: stripSpråkfil(bokmål),
    [LocaleType.nn]: stripSpråkfil(nynorsk),
    [LocaleType.en]: stripSpråkfil(engelsk),
};

export const hentUformaterteTekster = (tekstId: string): Record<LocaleType, string> => {
    const map = {};

    for (const locale in LocaleType) {
        map[locale] = texts[locale][tekstId];
    }

    return map as Record<LocaleType, string>;
};

export const sivilstandTilSanitySivilstandApiKey = (
    statuskode: ESivilstand
): ESanitySivilstandApiKey => {
    switch (statuskode) {
        case ESivilstand.UGIFT:
            return ESanitySivilstandApiKey.UGIFT;
        case ESivilstand.GIFT:
            return ESanitySivilstandApiKey.GIFT;
        case ESivilstand.ENKE_ELLER_ENKEMANN:
            return ESanitySivilstandApiKey.ENKE_ELLER_ENKEMANN;
        case ESivilstand.SKILT:
            return ESanitySivilstandApiKey.SKILT;
        case ESivilstand.SEPARERT:
            return ESanitySivilstandApiKey.SEPARERT;
        case ESivilstand.REGISTRERT_PARTNER:
            return ESanitySivilstandApiKey.REGISTRERT_PARTNER;
        case ESivilstand.SEPARERT_PARTNER:
            return ESanitySivilstandApiKey.SEPARERT_PARTNER;
        case ESivilstand.SKILT_PARTNER:
            return ESanitySivilstandApiKey.SKILT_PARTNER;
        case ESivilstand.GJENLEVENDE_PARTNER:
            return ESanitySivilstandApiKey.GJENLEVENDE_PARTNER;
        case ESivilstand.UOPPGITT:
            return ESanitySivilstandApiKey.UOPPGITT;
    }
};

export const hentBostedSpråkId = (barn: IBarn, teksterForSteg: IVelgBarnTekstinnhold) => {
    if (barn.adressebeskyttelse) {
        return teksterForSteg.registrertMedAdressesperre;
    } else if (barn.borMedSøker) {
        return teksterForSteg.registrertPaaAdressenDin;
    } else {
        return teksterForSteg.ikkeRegistrertPaaAdressenDin;
    }
};
