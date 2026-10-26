import { byggSuksessRessurs } from '@navikt/familie-typer';
import { format, subMonths } from 'date-fns';
import { HttpResponse, http } from 'msw';

import { BASE_PATH } from '../src/common/miljø';
import { ESivilstand } from '../src/common/typer/kontrakt/generelle';
import type { ISøkerRespons } from '../src/frontend/typer/person';

const personopplysning: ISøkerRespons = {
    ident: '23058518298',
    navn: 'Voksen Voksnessen',
    barn: [
        {
            ident: '12345678987',
            navn: 'Barn Barnessen III',
            borMedSøker: true,
            // Relativ dato, slik at barnet alltid er i kontantstøttealder.
            fødselsdato: format(subMonths(new Date(), 18), 'yyyy-MM-dd'),
            adressebeskyttelse: false,
        },
    ],
    statsborgerskap: [{ landkode: 'NOR' }],
    sivilstand: { type: ESivilstand.GIFT },
    adresse: {
        adressenavn: 'Solveien',
        postnummer: '2304',
        husbokstav: 'A',
        bruksenhetsnummer: 'H0101',
        husnummer: '2',
        poststed: 'HAMAR',
    },
    adressebeskyttelse: false,
};

// Ligger ikke i mocks/handlers.ts, siden svaret ville overskrevet søkeren i enhetstestene.
export const personopplysningHandler = http.get(`${BASE_PATH}api/personopplysning`, () =>
    HttpResponse.json(byggSuksessRessurs(personopplysning))
);
