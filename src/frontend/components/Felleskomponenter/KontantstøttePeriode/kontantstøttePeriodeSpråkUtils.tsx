import { PersonType } from '../../../typer/personType';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../SøknadsSteg/EøsSteg/Barn/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';
import { KontantstøttePeriodeSpørsmålId } from './spørsmål';

export const kontantstøtteLandFeilmelding = (
    periodenErAvsluttet: boolean,
    personType: PersonType
): string => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return periodenErAvsluttet
                ? 'modal.annenforelder-barnetrygd-fortid.feilmelding'
                : 'modal.annenforelder-barnetrygd-nåtid.feilmelding';
        }
        case PersonType.Omsorgsperson: {
            return periodenErAvsluttet
                ? 'modal.omsorgsperson-barnetrygd-fortid.feilmelding'
                : 'modal.omsorgsperson-barnetrygd-nåtid.feilmelding';
        }
        case PersonType.Søker:
        default: {
            return periodenErAvsluttet
                ? 'modal.hvilketlandbarnetrygd.feilmelding'
                : 'ombarnet.hvilketlandfår.feilmelding';
        }
    }
};

export const kontantstøtteSpørsmålSpråkId = (personType: PersonType, erDød?: boolean): string => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return erDød
                ? eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderKontantstøtteGjenlevende]
                : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderKontantstøtte];
        }
        case PersonType.Omsorgsperson: {
            return eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonKontantstøtte];
        }
        case PersonType.Søker:
        default:
            return omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.mottarEllerMottokEøsKontantstøtte];
    }
};

export const kontantstøttePeriodeFlereSpørsmål = (personType: PersonType): string => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'eøs-om-barn.andre-forelder-barnetrygd-flere-perioder.spm';
        case PersonType.Omsorgsperson:
            return 'eøs-om-barn.omsorgsperson-barnetrygd-flere-perioder.spm';
        case PersonType.Søker:
        default:
            return 'ombarnet.trygdandreperioder.spm';
    }
};

export const mottarKontantstøtteNåFeilmelding = (personType: PersonType) => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'modal.barnetrygdnå-annenforelder.feilmelding';
        case PersonType.Omsorgsperson:
            return 'modal.barnetrygdnå-omsorgsperson.feilmelding';
        case PersonType.Søker:
        default:
            return 'modal.barnetrygdnå.feilmelding';
    }
};

const kontantstøttePeriodeFellesSpørsmålSpråkId: Record<
    Exclude<
        KontantstøttePeriodeSpørsmålId,
        | KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå
        | KontantstøttePeriodeSpørsmålId.kontantstøtteLand
    >,
    string
> = {
    [KontantstøttePeriodeSpørsmålId.kontantstøttePeriodeEøs]: 'modal.trygdandreperioder.tittel',
    [KontantstøttePeriodeSpørsmålId.fraDatoKontantstøttePeriode]: 'modal.trygdnårbegynte.spm',
    [KontantstøttePeriodeSpørsmålId.tilDatoKontantstøttePeriode]: 'modal.trygdnåravsluttet.spm',
    [KontantstøttePeriodeSpørsmålId.månedligBeløp]: 'ombarnet.trygdbeløp.spm',
};

export const kontantstøttePeriodeSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<KontantstøttePeriodeSpørsmålId, string> => ({
    [KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå]: 'modal.barnetrygdnå.spm',
    [KontantstøttePeriodeSpørsmålId.kontantstøtteLand]: periodenErAvsluttet
        ? 'modal.hvilketlandbarnetrygd.spm'
        : 'ombarnet.hvilketlandfår.spm',
    ...kontantstøttePeriodeFellesSpørsmålSpråkId,
});

export const kontantstøttePeriodeAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<KontantstøttePeriodeSpørsmålId, string> => ({
    [KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå]:
        'modal.barnetrygdnå-annenforelder.spm',
    [KontantstøttePeriodeSpørsmålId.kontantstøtteLand]: periodenErAvsluttet
        ? 'modal.annenforelder-barnetrygd-fortid.spm'
        : 'modal.annenforelder-barnetrygd-nåtid.spm',
    ...kontantstøttePeriodeFellesSpørsmålSpråkId,
});

export const kontantstøttePeriodeOmsorgspersonSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<KontantstøttePeriodeSpørsmålId, string> => ({
    [KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå]:
        'modal.barnetrygdnå-omsorgsperson.spm',
    [KontantstøttePeriodeSpørsmålId.kontantstøtteLand]: periodenErAvsluttet
        ? 'modal.omsorgsperson-barnetrygd-fortid.spm'
        : 'modal.omsorgsperson-barnetrygd-nåtid.spm',
    ...kontantstøttePeriodeFellesSpørsmålSpråkId,
});

export const kontantstøttePeriodeModalSpørsmålSpråkId =
    (personType: PersonType, periodenErAvsluttet: boolean) =>
    (spørsmålId: KontantstøttePeriodeSpørsmålId): string => {
        switch (personType) {
            case PersonType.AndreForelder:
                return kontantstøttePeriodeAndreForelderSpørsmålSpråkId(periodenErAvsluttet)[
                    spørsmålId
                ];
            case PersonType.Omsorgsperson: {
                return kontantstøttePeriodeOmsorgspersonSpørsmålSpråkId(periodenErAvsluttet)[
                    spørsmålId
                ];
            }
            case PersonType.Søker:
            default:
                return kontantstøttePeriodeSøkerSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
        }
    };
