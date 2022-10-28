import { PersonType } from '../../../typer/personType';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

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
                    ? tekster().OM_BARNET.arbeidUtenforNorgeAndreForelderGjenlevende
                    : tekster().EØS_FOR_BARN.arbeidNorgeAndreForelderGjenlevende;
            } else {
                return gjelderUtlandet
                    ? tekster().OM_BARNET.arbeidUtenforNorgeAndreForelder
                    : tekster().EØS_FOR_BARN.arbeidNorgeAndreForelder;
            }
        }
        case PersonType.omsorgsperson: {
            return gjelderUtlandet
                ? tekster().EØS_FOR_BARN.arbeidUtenforNorgeOmsorgsperson
                : tekster().EØS_FOR_BARN.arbeidNorgeOmsorgsperson;
        }
        case PersonType.søker:
        default:
            return gjelderUtlandet
                ? tekster().DIN_LIVSSITUASJON.arbeidUtenforNorge
                : tekster().EØS_FOR_SØKER.arbeidNorge;
    }
};
