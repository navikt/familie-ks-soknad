import { ISODateString } from '@navikt/familie-form-elements';

import { dagenEtterDato, dagensDato, erSammeDatoSomDagensDato, morgendagensDato } from './dato';

export const minTilDatoForUtbetalingEllerArbeidsperiode = (
    periodenErAvsluttet: boolean,
    fraDato: ISODateString
) => {
    if (periodenErAvsluttet) {
        return dagenEtterDato(fraDato);
    } else if (erSammeDatoSomDagensDato(fraDato)) {
        return morgendagensDato();
    } else {
        return dagensDato();
    }
};
