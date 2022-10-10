import { PersonType } from '../../../typer/personType';
import { ESanitySteg, ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';

export const arbeidsperiodeOppsummeringOverskrift = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.periode'
        : 'felles.flerearbeidsperiodernorge.periode';

export const arbeidsperiodeLeggTilFlereKnapp = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.tittel'
        : 'felles.flerearbeidsperiodernorge.tittel';

export const arbeidsperiodeFlereSpørsmål = (
    gjelderUtlandet: boolean,
    personType: PersonType
): string => {
    switch (personType) {
        case PersonType.andreForelder:
            return gjelderUtlandet
                ? 'eøs.andre-forelder.arbeid-utland-perioder.spm'
                : 'eøs-om-barn.annenforelderflerearbeidsperiodenorge.spm';
        case PersonType.omsorgsperson:
            return gjelderUtlandet
                ? 'eøs-om-barn.omsorgsperson-arbeid-utland-perioder.spm'
                : 'eøs-om-barn.omsorgspersonflerearbeidsperiodenorge.spm';
        case PersonType.søker:
        default:
            return gjelderUtlandet
                ? 'eøs.arbeid-utland-perioder.spm'
                : 'eøs-om-deg.flerearbeidsperioderinorge.spm';
    }
};

export const arbeidsperiodeFeilmelding = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.feilmelding'
        : 'felles.flerearbeidsperiodernorge.feilmelding';

export const arbeidsperiodeSpørsmålDokument = (
    gjelderUtlandet: boolean,
    personType: PersonType,
    tekster: () => ITekstinnhold,
    erDød?: boolean
): ISanitySpørsmålDokument => {
    switch (personType) {
        case PersonType.andreForelder: {
            if (erDød) {
                return gjelderUtlandet
                    ? tekster()[ESanitySteg.OM_BARNET].arbeidUtenforNorgeAndreForelderGjenlevende
                    : tekster()[ESanitySteg.EØS_FOR_BARN].arbeidNorgeAndreForelderGjenlevende;
            } else {
                return gjelderUtlandet
                    ? tekster()[ESanitySteg.OM_BARNET].arbeidUtenforNorgeAndreForelder
                    : tekster()[ESanitySteg.EØS_FOR_BARN].arbeidNorgeAndreForelder;
            }
        }
        case PersonType.omsorgsperson: {
            return gjelderUtlandet
                ? tekster()[ESanitySteg.EØS_FOR_BARN].arbeidUtenforNorgeOmsorgsperson
                : tekster()[ESanitySteg.EØS_FOR_BARN].arbeidNorgeOmsorgsperson;
        }
        case PersonType.søker:
        default:
            return gjelderUtlandet
                ? tekster()[ESanitySteg.DIN_LIVSSITUASJON].arbeidUtenforNorge
                : tekster()[ESanitySteg.EØS_FOR_SØKER].arbeidNorge;
    }
};

export const arbeidsperiodeSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<ArbeidsperiodeSpørsmålsId, string> => ({
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]: 'felles.erarbeidsperiodenavsluttet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperioder]: 'eøs.arbeidetiutlandet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]: periodenErAvsluttet
        ? 'dinlivssituasjon.arbeid-utland.land.spm'
        : 'omdeg.arbeid-utland.land.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsgiver]: 'felles.oppgiarbeidsgiver',
    [ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]: 'felles.nårbegyntearbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]: periodenErAvsluttet
        ? 'felles.nåravsluttetarbeidsperiode.spm'
        : 'felles.nåravsluttesarbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke]:
        'felles.nåravsluttesarbeidsperiode.sjekkboks',
});

export const arbeidsperiodeAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<ArbeidsperiodeSpørsmålsId, string> => ({
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]: 'felles.erarbeidsperiodenavsluttet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperioder]: 'eøs.arbeidetiutlandet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]: periodenErAvsluttet
        ? 'enkeenkemann.andreforelder-arbeidutland.land.spm'
        : 'ombarnet.andre-forelder.arbeid-utland.land.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsgiver]: 'felles.oppgiarbeidsgiver',
    [ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]: 'felles.nårbegyntearbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]: periodenErAvsluttet
        ? 'felles.nåravsluttetarbeidsperiode.spm'
        : 'felles.nåravsluttesarbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke]:
        'felles.nåravsluttesarbeidsperiode.sjekkboks',
});

export const arbeidsperiodeOmsorgspersonSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<ArbeidsperiodeSpørsmålsId, string> => ({
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]: 'felles.erarbeidsperiodenavsluttet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperioder]: 'eøs.arbeidetiutlandet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]: periodenErAvsluttet
        ? 'modal.omsorgsperson-arbeid-utland.land-fortid.spm'
        : 'modal.omsorgsperson-arbeid-utland.land-nåtid.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsgiver]: 'felles.oppgiarbeidsgiver',
    [ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]: 'felles.nårbegyntearbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]: periodenErAvsluttet
        ? 'felles.nåravsluttetarbeidsperiode.spm'
        : 'felles.nåravsluttesarbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke]:
        'felles.nåravsluttesarbeidsperiode.sjekkboks',
});

export const arbeidsperiodeModalSpørsmålSpråkId =
    (personType: PersonType, periodenErAvsluttet: boolean) =>
    (spørsmålId: ArbeidsperiodeSpørsmålsId): string => {
        switch (personType) {
            case PersonType.andreForelder:
                return arbeidsperiodeAndreForelderSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.omsorgsperson:
                return arbeidsperiodeOmsorgspersonSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.søker:
            default:
                return arbeidsperiodeSøkerSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
        }
    };
