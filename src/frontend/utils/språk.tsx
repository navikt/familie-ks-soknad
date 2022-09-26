import React, { ReactElement } from 'react';

import { Alpha3Code, alpha3ToAlpha2, getName } from 'i18n-iso-countries';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { createIntl, createIntlCache } from 'react-intl';

import { LocaleType } from '@navikt/familie-sprakvelger';

import * as engelsk from '../assets/lang/en.json' assert { type: 'json' };
import * as bokmål from '../assets/lang/nb.json' assert { type: 'json' };
import * as nynorsk from '../assets/lang/nn.json' assert { type: 'json' };
import { innebygdeFormatterere } from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import TekstBlock from '../components/Felleskomponenter/TekstBlock';
import { AlternativtSvarForInput, LocaleRecordBlock, LocaleRecordString } from '../typer/common';
import { ESivilstand, Slektsforhold } from '../typer/kontrakt/generelle';
import { IBarn } from '../typer/person';
import { ESanitySivilstandApiKey } from '../typer/sanity/sanity';

export const toSlektsforholdSpråkId = (slektsforhold: Slektsforhold): string => {
    switch (slektsforhold) {
        case Slektsforhold.FORELDER:
            return 'felles.velgslektsforhold.forelder';
        case Slektsforhold.BESTEFORELDER:
            return 'felles.velgslektsforhold.besteforelder';
        case Slektsforhold.ONKEL_ELLER_TANTE:
            return 'felles.velgslektsforhold.onkeltante';
        case Slektsforhold.ANNEN_FAMILIERELASJON:
            return 'felles.velgslektsforhold.annenfamilie';
        case Slektsforhold.ANNEN_RELASJON:
            return 'felles.velgslektsforhold.annenrelasjon';
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

const cache = createIntlCache();

const innholdForLocale = (
    sanityTekst: LocaleRecordString | LocaleRecordBlock,
    locale: LocaleType
) => {
    return typeof sanityTekst[locale] !== 'string' ? (
        <TekstBlock block={sanityTekst as LocaleRecordBlock} spesifisertLocale={locale} />
    ) : (
        sanityTekst[locale]
    );
};

export const sanitizedLocaleRecord = (
    sanityTekst: LocaleRecordString | LocaleRecordBlock
): Record<LocaleType, string> => {
    return {
        //todo: caster til string enn så lenge, til vi får støtte for at Portable Text kan returnere tekst i stedet for ReactNode
        [LocaleType.en]: innholdForLocale(sanityTekst, LocaleType.en) as string,
        [LocaleType.nn]: innholdForLocale(sanityTekst, LocaleType.nn) as string,
        [LocaleType.nb]: innholdForLocale(sanityTekst, LocaleType.nb) as string,
    };
};

export const hentTekster = (
    tekstId: string,
    formatValues: object = {}
): Record<LocaleType, string> => {
    const map = {};

    for (const locale in LocaleType) {
        const { formatMessage } = createIntl({ locale, messages: texts[locale] }, cache);
        const message = tekstId
            ? formatMessage(
                  { id: tekstId },
                  // Fjerner bokmål-tagen, skapte problemer og trenger ikke være med til pdf-gen
                  { ...formatValues, ...innebygdeFormatterere, bokmål: msg => msg }
              )
            : '';

        map[locale] = message && reactElementToJSXString(message as ReactElement);
    }

    // Typescript er ikke smart nok til å se at alle locales er satt
    return map as Record<LocaleType, string>;
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

export const hentBostedSpråkId = (barn: IBarn) => {
    if (barn.adressebeskyttelse) {
        return 'hvilkebarn.barn.bosted.adressesperre';
    } else if (barn.borMedSøker) {
        return 'hvilkebarn.barn.bosted.din-adresse';
    } else {
        return 'hvilkebarn.barn.bosted.ikke-din-adresse';
    }
};
