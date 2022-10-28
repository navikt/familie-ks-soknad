import { PersonType } from '../../../typer/personType';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

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
