import { PersonType } from '../../../typer/personType';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../SøknadsSteg/EøsSteg/Barn/spørsmål';
import {
    EøsSøkerSpørsmålId,
    eøsSøkerSpørsmålSpråkId,
} from '../../SøknadsSteg/EøsSteg/Søker/spørsmål';
import { UtbetalingerSpørsmålId } from './spørsmål';

export const mottarEllerMottattUtbetalingSpråkId = (
    personType: PersonType,
    erDød?: boolean
): string => {
    switch (personType) {
        case PersonType.AndreForelder:
            return erDød
                ? eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke]
                : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAndreUtbetalinger];
        case PersonType.Omsorgsperson:
            return eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonAndreUtbetalinger];
        case PersonType.Søker:
        default:
            return eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.utbetalinger];
    }
};

export const utbetalingerFlerePerioderSpmSpråkId = (personType: PersonType) => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'eøs-om-barn.andreforelder-utbetalinger-andreperioder.spm';
        case PersonType.Omsorgsperson:
            return 'eøs-om-barn.omsorgsperson-utbetalinger-flere-perioder.spm';
        case PersonType.Søker:
        default:
            return 'eøs-om-deg.flere-utbetalinger.spm';
    }
};

export const fårUtbetalingNåFeilmelding = (personType: PersonType) => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'eøs.andreforelderutbetalinger.feilmelding';
        case PersonType.Omsorgsperson:
            return 'modal.omsorgsperson-utbetalinger.feilmelding';
        case PersonType.Søker:
        default:
            return 'eøs.utbetalinger.feilmelding';
    }
};

export const utbetalingslandFeilmelding = (
    personType: PersonType,
    periodenErAvsluttet: boolean
) => {
    switch (personType) {
        case PersonType.AndreForelder:
            return periodenErAvsluttet
                ? 'modal.andreforelder-utbetalingerland-fikk.feilmelding'
                : 'modal.andreforelder-utbetalingerland-får.feilmelding';
        case PersonType.Omsorgsperson:
            return periodenErAvsluttet
                ? 'modal.omsorgsperson-utbetalingerland-fortid.feilmelding'
                : 'modal.omsorgsperson-utbetalingerland-nåtid.feilmelding';
        case PersonType.Søker:
        default:
            return periodenErAvsluttet
                ? 'modal.utbetalingsland-fikk-søker.feilmeldinger'
                : 'modal.utbetalingsland-får-søker.feilmelding';
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
            case PersonType.AndreForelder:
                return utbetalingerAndreForelderSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.Omsorgsperson:
                return utbetalingerOmsorgspersonSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.Søker:
            default:
                return utbetalingerSøkerSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
        }
    };
