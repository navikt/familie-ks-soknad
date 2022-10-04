import { isPortableTextSpan } from '@portabletext/toolkit';
import {
    ArbitraryTypedObject,
    PortableTextBlock,
    PortableTextMarkDefinition,
    PortableTextSpan,
} from '@portabletext/types';
import { pipe } from 'ramda';

import { LocaleType } from '@navikt/familie-sprakvelger';

import { LocaleRecordBlock, LocaleRecordString } from '../typer/common';
import { IAndreUtbetalingerTekstinnhold } from '../typer/sanity/modaler/andreUtbetalinger';
import { IArbeidsperiodeTekstinnhold } from '../typer/sanity/modaler/arbeidsperiode';
import { IBarnehageplassTekstinnhold } from '../typer/sanity/modaler/barnehageplass';
import { IEøsYtelseTekstinnhold } from '../typer/sanity/modaler/eøsYtelse';
import { ILeggTilBarnTekstinnhold } from '../typer/sanity/modaler/leggTilBarn';
import { IPensjonsperiodeTekstinnhold } from '../typer/sanity/modaler/pensjonsperiode';
import { IStartPåNyttModal } from '../typer/sanity/modaler/startPåNytt';
import { IUtenlandsoppholdTekstinnhold } from '../typer/sanity/modaler/utenlandsopphold';
import {
    EFlettefeltverdi,
    ESanitySteg,
    frittståendeOrdPrefix,
    modalPrefix,
    navigasjonPrefix,
    SanityDokument,
} from '../typer/sanity/sanity';
import {
    IFellesTekstInnhold,
    IFrittståendeOrdTekstinnhold,
    IModalerTekstinnhold,
    INavigasjonTekstinnhold,
    ITekstinnhold,
    SanityModalPrefix,
    SanityPersonType,
} from '../typer/sanity/tekstInnhold';

const strukturerInnholdForSteg = (
    dokumenter: SanityDokument[],
    steg: ESanitySteg
): { [key: string]: SanityDokument } =>
    dokumenter
        .filter(dok => dok.steg === steg)
        .reduce((acc, dok) => {
            return { ...acc, [dok.api_navn]: dok };
        }, {});

const struktrerInnholdForFelles = (
    dokumenter: SanityDokument[],
    personType?: SanityPersonType
): Partial<IFellesTekstInnhold> =>
    dokumenter
        .filter(dok => (personType ? dok._type.includes(personType) : dok))
        .reduce((acc, dok) => {
            return { ...acc, [dok.api_navn]: dok };
        }, {});

const dokumenterFiltrertPåPrefix = (dokumenter: SanityDokument[], prefix) =>
    dokumenter.filter(dok => dok._type.includes(prefix));

const strukturertInnholdForModaler = (dokumenter: SanityDokument[]): IModalerTekstinnhold => {
    const strukturerInnholdForModal = (prefix: string, personType?: SanityPersonType) =>
        struktrerInnholdForFelles(dokumenterFiltrertPåPrefix(dokumenter, prefix), personType);

    const arbeidsperiode = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.ARBEIDSPERIODE,
            personType
        ) as IArbeidsperiodeTekstinnhold;

    const pensjonsperiode = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.PENSJONSPERIODE,
            personType
        ) as IPensjonsperiodeTekstinnhold;

    const andreUtbetalinger = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.ANDRE_UTBETALINGER,
            personType
        ) as IAndreUtbetalingerTekstinnhold;

    const utenlandsopphold = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.UTENLANDSOPPHOLD,
            personType
        ) as IUtenlandsoppholdTekstinnhold;

    const eøsYtelse = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.EOS_YTELSE,
            personType
        ) as IEøsYtelseTekstinnhold;

    return {
        arbeidsperiode: {
            andreForelder: arbeidsperiode(SanityPersonType.ANDRE_FORELDER),
            søker: arbeidsperiode(SanityPersonType.SOKER),
            omsorgsperson: arbeidsperiode(SanityPersonType.OMSORGSPERSON),
        },
        pensjonsperiode: {
            andreForelder: pensjonsperiode(SanityPersonType.ANDRE_FORELDER),
            søker: pensjonsperiode(SanityPersonType.SOKER),
            omsorgsperson: pensjonsperiode(SanityPersonType.OMSORGSPERSON),
        },
        andreUtbetalinger: {
            andreForelder: andreUtbetalinger(SanityPersonType.ANDRE_FORELDER),
            søker: andreUtbetalinger(SanityPersonType.SOKER),
            omsorgsperson: andreUtbetalinger(SanityPersonType.OMSORGSPERSON),
        },
        utenlandsopphold: {
            søker: utenlandsopphold(SanityPersonType.SOKER),
            barn: utenlandsopphold(SanityPersonType.BARN),
            andreForelder: utenlandsopphold(SanityPersonType.ANDRE_FORELDER),
        },
        eøsYtelse: {
            søker: eøsYtelse(SanityPersonType.SOKER),
            andreForelder: eøsYtelse(SanityPersonType.ANDRE_FORELDER),
            omsorgsperson: eøsYtelse(SanityPersonType.OMSORGSPERSON),
        },
        barnehageplass: strukturerInnholdForModal(
            SanityModalPrefix.BARNEHAGEPLASS
        ) as IBarnehageplassTekstinnhold,
        leggTilBarn: strukturerInnholdForModal(
            SanityModalPrefix.LEGG_TIL_BARN
        ) as ILeggTilBarnTekstinnhold,
        startPåNytt: strukturerInnholdForModal(
            SanityModalPrefix.START_PAA_NYTT
        ) as IStartPåNyttModal,
    };
};

export const transformerTilTekstinnhold = (alleDokumenter: SanityDokument[]): ITekstinnhold => {
    const fellesDokumenter = alleDokumenter.filter(dok => dok.steg === ESanitySteg.FELLES);

    const tekstInnhold: Partial<ITekstinnhold> = {};

    for (const steg in ESanitySteg) {
        ESanitySteg[steg] !== ESanitySteg.FELLES &&
            (tekstInnhold[ESanitySteg[steg]] = strukturerInnholdForSteg(
                alleDokumenter,
                ESanitySteg[steg]
            ));
    }

    tekstInnhold[ESanitySteg.FELLES] = {
        modaler: {
            ...strukturertInnholdForModaler(
                dokumenterFiltrertPåPrefix(fellesDokumenter, modalPrefix)
            ),
        },
        frittståendeOrd: struktrerInnholdForFelles(
            dokumenterFiltrertPåPrefix(fellesDokumenter, frittståendeOrdPrefix)
        ) as IFrittståendeOrdTekstinnhold,
        navigasjon: struktrerInnholdForFelles(
            dokumenterFiltrertPåPrefix(fellesDokumenter, navigasjonPrefix)
        ) as INavigasjonTekstinnhold,
    };
    console.log(tekstInnhold);
    return tekstInnhold as ITekstinnhold;
};

const tranformMarks = (
    span: PortableTextSpan,
    block: PortableTextBlock<
        PortableTextMarkDefinition,
        ArbitraryTypedObject | PortableTextSpan,
        string,
        string
    >,
    customMarks: { flettefelt: (props: { value: { flettefeltVerdi } }) => string }
) => {
    return span.marks?.map(name => node => {
        const markDef = block.markDefs?.find(({ _key }) => _key === name);
        const mark = markDef && customMarks[markDef._type];

        return mark
            ? {
                  ...node,
                  text: mark({
                      ...node,
                      value: markDef,
                  }),
              }
            : node;
    });
};

// Denne funksjonen har kopiert mye fra en tråd i Sanity-slacken:
// https://sanity-io.slack.com/archives/CF876M37F/p1664206409432079?thread_ts=1663841434.772959&cid=CF876M37F
export const plainTekstHof =
    (
        flettefeltTilTekst: (flettefeltVerdi: EFlettefeltverdi, barnetsNavn?: string) => string,
        søknadLocale: LocaleType
    ) =>
    (
        localeRecord: LocaleRecordBlock | LocaleRecordString,
        barnetsNavn?: string,
        spesifikkLocale?: LocaleType
    ): string => {
        const innholdForLocale = localeRecord[spesifikkLocale ?? søknadLocale];

        if (typeof innholdForLocale === 'string') {
            return innholdForLocale;
        }

        const marks = {
            flettefelt: props => {
                if (props.value.flettefeltVerdi) {
                    return flettefeltTilTekst(props.value.flettefeltVerdi, barnetsNavn);
                } else {
                    throw new Error(`Fant ikke flettefeltVerdi`);
                }
            },
        };

        const leadingSpace = /^\s/;
        const trailingSpace = /^\s/;

        let tekst = '';

        innholdForLocale.forEach((block, index) => {
            let previousElementIsNonSpan = false;

            block.children.forEach(child => {
                if (isPortableTextSpan(child)) {
                    // If the previous element was a non-span, and we have no natural whitespace
                    // between the previous and the next span, insert it to give the spans some
                    // room to breathe. However, don't do so if this is the first span.
                    tekst +=
                        previousElementIsNonSpan &&
                        tekst &&
                        !trailingSpace.test(tekst) &&
                        !leadingSpace.test(child.text)
                            ? ' '
                            : '';

                    const transformedMarks = tranformMarks(child, block, marks);

                    tekst += transformedMarks
                        ? pipe(node => node, ...transformedMarks)(child).text
                        : pipe(node => node)(child).text;
                    previousElementIsNonSpan = false;
                } else {
                    previousElementIsNonSpan = true;
                }
            });

            if (index !== innholdForLocale.length - 1) {
                tekst += '\n\n';
            }
        });

        return tekst;
    };
