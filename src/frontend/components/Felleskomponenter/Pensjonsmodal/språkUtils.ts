import { PersonType } from '../../../typer/personType';
import { ESanitySteg, ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

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
