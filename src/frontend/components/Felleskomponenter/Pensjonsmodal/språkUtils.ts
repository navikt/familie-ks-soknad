import { PersonType } from '../../../typer/personType';
import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
} from '../../SøknadsSteg/DinLivssituasjon/spørsmål';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../SøknadsSteg/EøsSteg/Barn/spørsmål';
import {
    EøsSøkerSpørsmålId,
    eøsSøkerSpørsmålSpråkId,
} from '../../SøknadsSteg/EøsSteg/Søker/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';
import { PensjonsperiodeSpørsmålId } from './spørsmål';

export const mottarPensjonNåFeilmeldingSpråkId = (personType: PersonType): string => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'ombarnet.andre-forelder.pensjonnå.feilmelding';
        case PersonType.Omsorgsperson:
            return 'modal.omsorgsperson.pensjonnå.feilmelding';
        case PersonType.Søker:
        default:
            return 'modal.fårdupensjonnå.feilmelding';
    }
};

export const pensjonslandFeilmeldingSpråkId = (personType, periodenErAvsluttet) => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return periodenErAvsluttet
                ? 'modal.hvilketlandpensjonandreforelder.feilmelding'
                : 'ombarnet.andre-forelder.utenlandspensjon.land.feilmelding';
        }
        case PersonType.Omsorgsperson: {
            return periodenErAvsluttet
                ? 'modal.hvilketlandpensjon-fortid-omsorgsperson.feilmelding'
                : 'modal.hvilketlandpensjon-nåtid-omsorgsperson.feilmelding';
        }
        case PersonType.Søker:
        default: {
            return periodenErAvsluttet
                ? 'felles.hvilketlandpensjon.feilmelding'
                : 'omdeg.utenlandspensjon.land.feilmelding';
        }
    }
};

export const pensjonFraDatoFeilmeldingSpråkId = (personType, periodenErAvsluttet) => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return periodenErAvsluttet
                ? 'modal.franårandreforelderpensjon.feilmelding'
                : 'pensjonmodal.franårpensjonandreforelder.nåtid.feilmelding';
        }
        case PersonType.Omsorgsperson: {
            return periodenErAvsluttet
                ? 'felles.modal.franårpensjon-omsorgsperson-fortid.feilmelding'
                : 'felles.modal.franårpensjon-omsorgsperson-nåtid.feilmelding';
        }
        case PersonType.Søker:
        default: {
            return periodenErAvsluttet
                ? 'felles.modal.franårfikkpensjon.feilmelding'
                : 'pensjonmodal.franårpensjon.nåtid.feilmelding';
        }
    }
};

export const pensjonsperiodeKnappSpråkId = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.leggtilpensjon.utland.modal.tittel'
        : 'felles.leggtilpensjon.norge.knapp';

export const pensjonsperiodeFeilmelding = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.modal.leggtilpensjonutland.feilmelding'
        : 'felles.modal.leggtilpensjonnorge.feilmelding';

export const pensjonFlerePerioderSpmSpråkId = (
    gjelderUtlandet: boolean,
    personType: PersonType
): string => {
    switch (personType) {
        case PersonType.AndreForelder:
            return gjelderUtlandet
                ? 'ombarnet.flerepensjonsperioder.spm'
                : 'eøs-om-barn.leggtilpensjonandreforelder.spm';
        case PersonType.Omsorgsperson:
            return gjelderUtlandet
                ? 'eøs-om-barn.omsorgsperson-pensjon-utland-flere-perioder.spm'
                : 'eøs-om-barn.omsorgsperson-pensjon-norge-flere-perioder.spm';
        case PersonType.Søker:
        default:
            return gjelderUtlandet
                ? 'omdeg.leggtilpensjonutland.spm'
                : 'eøs-om-deg.leggtilpensjon.spm';
    }
};

export const mottarEllerMottattPensjonSpråkId = (
    gjelderUtlandet: boolean,
    personType: PersonType,
    erDød?: boolean
): string => {
    switch (personType) {
        case PersonType.AndreForelder: {
            if (erDød) {
                return gjelderUtlandet
                    ? omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderPensjonUtlandEnke]
                    : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderPensjonNorgeEnke];
            } else {
                return gjelderUtlandet
                    ? omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderPensjonUtland]
                    : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderPensjonNorge];
            }
        }
        case PersonType.Omsorgsperson: {
            return gjelderUtlandet
                ? eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonPensjonUtland]
                : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonPensjonNorge];
        }
        case PersonType.Søker:
        default: {
            return gjelderUtlandet
                ? dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.mottarUtenlandspensjon]
                : eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.pensjonNorge];
        }
    }
};

export const pensjonsperiodeOppsummeringOverskrift = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.leggtilpensjon.periode.utland'
        : 'felles.leggtilpensjon.periode.norge';

export const pensjonSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<
    Exclude<PensjonsperiodeSpørsmålId, PensjonsperiodeSpørsmålId.pensjonsperioder>,
    string
> => ({
    [PensjonsperiodeSpørsmålId.mottarPensjonNå]: 'modal.fårdupensjonnå.spm',
    [PensjonsperiodeSpørsmålId.pensjonsland]: periodenErAvsluttet
        ? 'felles.hvilketlandpensjon.spm'
        : 'omdeg.utenlandspensjon.land.spm',
    [PensjonsperiodeSpørsmålId.fraDatoPensjon]: periodenErAvsluttet
        ? 'felles.modal.franårfikkpensjon.spm'
        : 'felles.franårpensjon.spm',
    [PensjonsperiodeSpørsmålId.tilDatoPensjon]: 'felles.nåravsluttetpensjon.spm',
});

export const pensjonAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<
    Exclude<PensjonsperiodeSpørsmålId, PensjonsperiodeSpørsmålId.pensjonsperioder>,
    string
> => ({
    [PensjonsperiodeSpørsmålId.mottarPensjonNå]: 'ombarnet.andre-forelder.pensjonnå.spm',
    [PensjonsperiodeSpørsmålId.pensjonsland]: periodenErAvsluttet
        ? 'modal.hvilketlandpensjonandreforelder.spm'
        : 'ombarnet.andre-forelder.utenlandspensjon.land.spm',
    [PensjonsperiodeSpørsmålId.fraDatoPensjon]: periodenErAvsluttet
        ? 'modal.franårandreforelderpensjon.spm'
        : 'pensjonmodal.franårpensjonandreforelder.nåtid.spm',
    [PensjonsperiodeSpørsmålId.tilDatoPensjon]: 'felles.nåravsluttetpensjon.spm',
});

export const pensjonOmsorgspersonSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<
    Exclude<PensjonsperiodeSpørsmålId, PensjonsperiodeSpørsmålId.pensjonsperioder>,
    string
> => ({
    [PensjonsperiodeSpørsmålId.mottarPensjonNå]: 'modal.omsorgsperson.pensjonnå.spm',
    [PensjonsperiodeSpørsmålId.pensjonsland]: periodenErAvsluttet
        ? 'modal.hvilketlandpensjon-fortid-omsorgsperson.spm'
        : 'modal.hvilketlandpensjon-nåtid-omsorgsperson.spm',
    [PensjonsperiodeSpørsmålId.fraDatoPensjon]: periodenErAvsluttet
        ? 'felles.modal.franårpensjon-omsorgsperson-fortid.spm'
        : 'felles.modal.franårpensjon-omsorgsperson-nåtid.spm',
    [PensjonsperiodeSpørsmålId.tilDatoPensjon]: 'felles.nåravsluttetpensjon.spm',
});

export const pensjonsperiodeModalSpørsmålSpråkId =
    (personType: PersonType, periodenErAvsluttet: boolean) =>
    (spørsmålId: PensjonsperiodeSpørsmålId): string => {
        switch (personType) {
            case PersonType.AndreForelder:
                return pensjonAndreForelderSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.Omsorgsperson:
                return pensjonOmsorgspersonSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.Søker:
            default:
                return pensjonSøkerSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
        }
    };
