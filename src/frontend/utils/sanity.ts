import { IAndreUtbetalingerTekstinnhold } from '../typer/sanity/modaler/andreUtbetalinger';
import { IArbeidsperiodeTekstinnhold } from '../typer/sanity/modaler/arbeidsperiode';
import { IBarnehageplassTekstinnhold } from '../typer/sanity/modaler/barnehageplass';
import { IEøsYtelseTekstinnhold } from '../typer/sanity/modaler/eøsYtelse';
import { ILeggTilBarnTekstinnhold } from '../typer/sanity/modaler/leggTilBarn';
import { IPensjonsperiodeTekstinnhold } from '../typer/sanity/modaler/pensjonsperiode';
import { IStartPåNyttModal } from '../typer/sanity/modaler/startPåNytt';
import { IUtenlandsoppholdTekstinnhold } from '../typer/sanity/modaler/utenlandsopphold';
import {
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
    return tekstInnhold as ITekstinnhold;
};
