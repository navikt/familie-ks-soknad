import { PersonType } from '../../../typer/personType';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';
import { UtbetalingerSpørsmålId } from './spørsmål';

export const mottarEllerMottattUtbetalingApiNavn = (
    personType: PersonType,
    tekster: ITekstinnhold,
    erDød?: boolean
): ISanitySpørsmålDokument => {
    switch (personType) {
        case PersonType.andreForelder:
            return erDød
                ? tekster.EØS_FOR_BARN.utbetalingerAndreForelderGjenlevende
                : tekster.EØS_FOR_BARN.utbetalingerAndreForelder;
        case PersonType.omsorgsperson:
            return tekster.EØS_FOR_BARN.utbetalingerOmsorgsperson;
        case PersonType.søker:
        default:
            return tekster.EØS_FOR_SØKER.utbetalinger;
    }
};

export const utbetalingerFlerePerioderSpmSpråkId = (personType: PersonType) => {
    switch (personType) {
        case PersonType.andreForelder:
            return 'eøs-om-barn.andreforelder-utbetalinger-andreperioder.spm';
        case PersonType.omsorgsperson:
            return 'eøs-om-barn.omsorgsperson-utbetalinger-flere-perioder.spm';
        case PersonType.søker:
        default:
            return 'eøs-om-deg.flere-utbetalinger.spm';
    }
};

export const fårUtbetalingNåFeilmelding = (personType: PersonType) => {
    switch (personType) {
        case PersonType.andreForelder:
            return 'eøs.andreforelderutbetalinger.feilmelding';
        case PersonType.omsorgsperson:
            return 'modal.omsorgsperson-utbetalinger.feilmelding';
        case PersonType.søker:
        default:
            return 'eøs.utbetalinger.feilmelding';
    }
};

const utbetalingsperiodeFellesSpørsmålSpråkId = (
    periodenErAvsluttet: boolean
): Record<
    Exclude<
        UtbetalingerSpørsmålId,
        | UtbetalingerSpørsmålId.fårUtbetalingNå
        | UtbetalingerSpørsmålId.utbetalingLand
        | UtbetalingerSpørsmålId.utbetalingsperioder
    >,
    string
> => ({
    [UtbetalingerSpørsmålId.utbetalingFraDato]: 'felles.nårbegynteutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDato]: periodenErAvsluttet
        ? 'felles.nårstoppetutbetalingene.spm'
        : 'felles.nårstopperutbetalingene.spm',
    [UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]:
        'felles.vetikkenårutbetalingerstopper.sjekkboks',
});

export const utbetalingerSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.utbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingLand]: periodenErAvsluttet
        ? 'modal.utbetalingsland-fikk-søker.spm'
        : 'modal.utbetalingsland-får-søker.spm',
    ...utbetalingsperiodeFellesSpørsmålSpråkId(periodenErAvsluttet),
});

export const utbetalingerAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'eøs.andreforelderutbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingLand]: periodenErAvsluttet
        ? 'modal.andreforelder-utbetalingerland-fikk.spm'
        : 'modal.andreforelder-utbetalingerland-får.spm',
    ...utbetalingsperiodeFellesSpørsmålSpråkId(periodenErAvsluttet),
});

export const utbetalingerOmsorgspersonSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<Exclude<UtbetalingerSpørsmålId, UtbetalingerSpørsmålId.utbetalingsperioder>, string> => ({
    [UtbetalingerSpørsmålId.fårUtbetalingNå]: 'modal.omsorgsperson-utbetalinger.spm',
    [UtbetalingerSpørsmålId.utbetalingLand]: periodenErAvsluttet
        ? 'modal.omsorgsperson-utbetalingerland-fortid.spm'
        : 'modal.omsorgsperson-utbetalingerland-nåtid.spm',
    ...utbetalingsperiodeFellesSpørsmålSpråkId(periodenErAvsluttet),
});

export const utbetalingsperiodeModalSpørsmålSpråkIder =
    (personType: PersonType, periodenErAvsluttet: boolean) =>
    (spørsmålId: UtbetalingerSpørsmålId): string => {
        switch (personType) {
            case PersonType.andreForelder:
                return utbetalingerAndreForelderSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.omsorgsperson:
                return utbetalingerOmsorgspersonSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.søker:
            default:
                return utbetalingerSøkerSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
        }
    };
