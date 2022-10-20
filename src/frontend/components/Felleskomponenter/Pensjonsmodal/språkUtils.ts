import { PersonType } from '../../../typer/personType';
import { ESanitySteg, ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';
import { PensjonsperiodeSpørsmålId } from './spørsmål';

export const mottarPensjonNåFeilmeldingSpråkId = (personType: PersonType): string => {
    switch (personType) {
        case PersonType.andreForelder:
            return 'ombarnet.andre-forelder.pensjonnå.feilmelding';
        case PersonType.omsorgsperson:
            return 'modal.omsorgsperson.pensjonnå.feilmelding';
        case PersonType.søker:
        default:
            return 'modal.fårdupensjonnå.feilmelding';
    }
};

export const pensjonsperiodeFeilmelding = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.modal.leggtilpensjonutland.feilmelding'
        : 'felles.modal.leggtilpensjonnorge.feilmelding';

export const pensjonSpørsmålDokument = (
    gjelderUtlandet: boolean,
    personType: PersonType,
    tekster: () => ITekstinnhold,
    erDød?: boolean
): ISanitySpørsmålDokument => {
    switch (personType) {
        case PersonType.andreForelder: {
            if (erDød) {
                return gjelderUtlandet
                    ? tekster()[ESanitySteg.OM_BARNET].pensjonUtlandAndreForelderGjenlevende
                    : tekster()[ESanitySteg.EØS_FOR_BARN].pensjonNorgeAndreForelderGjenlevende;
            } else {
                return gjelderUtlandet
                    ? tekster()[ESanitySteg.OM_BARNET].pensjonUtlandAndreForelder
                    : tekster()[ESanitySteg.EØS_FOR_BARN].pensjonNorgeAndreForelder;
            }
        }
        case PersonType.omsorgsperson: {
            return gjelderUtlandet
                ? tekster()[ESanitySteg.EØS_FOR_BARN].pensjonUtlandOmsorgsperson
                : tekster()[ESanitySteg.EØS_FOR_BARN].pensjonNorgeOmsorgsperson;
        }
        case PersonType.søker:
        default: {
            return gjelderUtlandet
                ? tekster()[ESanitySteg.DIN_LIVSSITUASJON].pensjonUtland
                : tekster()[ESanitySteg.EØS_FOR_SØKER].pensjonNorge;
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
            case PersonType.andreForelder:
                return pensjonAndreForelderSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.omsorgsperson:
                return pensjonOmsorgspersonSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.søker:
            default:
                return pensjonSøkerSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
        }
    };
