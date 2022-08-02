import { ISøker } from '../typer/person';

export const nullstilteEøsFelterForSøker = (søker: ISøker) => ({
    idNummer: [],
    adresseISøkeperiode: {
        ...søker.adresseISøkeperiode,
        svar: '',
    },
    arbeidINorge: {
        ...søker.arbeidINorge,
        svar: null,
    },
    arbeidsperioderNorge: [],
    pensjonNorge: {
        ...søker.pensjonNorge,
        svar: null,
    },
    pensjonsperioderNorge: [],
    andreUtbetalinger: {
        ...søker.andreUtbetalinger,
        svar: null,
    },
    andreUtbetalingsperioder: [],
});
