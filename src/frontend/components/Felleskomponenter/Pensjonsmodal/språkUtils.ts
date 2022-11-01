import { LocaleRecordBlock } from '../../../typer/common';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg, ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

export const mottarPensjonNåFeilmelding = ({
    personType,
    gjelderUtland,
    tekster,
}: {
    personType: PersonType;
    gjelderUtland: boolean;
    tekster: ITekstinnhold;
}): LocaleRecordBlock => {
    const eøsForBarnTekstinnhold = tekster.EØS_FOR_BARN;
    const eøsForSøkerTekstinnhold = tekster.EØS_FOR_SØKER;
    const dinLivssituasjonTekstinnhold = tekster.DIN_LIVSSITUASJON;
    const omBarnetTekstinnhold = tekster.OM_BARNET;

    switch (personType) {
        case PersonType.andreForelder:
            if (gjelderUtland) {
                return omBarnetTekstinnhold.pensjonUtlandAndreForelder.feilmelding;
            } else {
                return eøsForBarnTekstinnhold.pensjonNorgeAndreForelder.feilmelding;
            }
        case PersonType.omsorgsperson:
            if (gjelderUtland) {
                return eøsForBarnTekstinnhold.pensjonUtlandOmsorgsperson.feilmelding;
            } else {
                return eøsForBarnTekstinnhold.pensjonNorgeOmsorgsperson.feilmelding;
            }
        case PersonType.søker:
            if (gjelderUtland) {
                return dinLivssituasjonTekstinnhold.pensjonUtland.feilmelding;
            } else {
                return eøsForSøkerTekstinnhold.pensjonNorge.feilmelding;
            }
        case PersonType.barn:
            throw Error('Prøver å hente pensjon for barn');
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
