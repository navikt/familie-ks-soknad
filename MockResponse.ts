import { ApiRessurs, RessursStatus } from '@navikt/familie-typer';

import { ESivilstand } from './src/frontend/typer/kontrakt/generelle';
import { IBarn, IBarnRespons, ISøkerRespons } from './src/frontend/typer/person';

export function barnResponsFixture(props: Partial<IBarnRespons> = {}): IBarnRespons {
    const standardVerdi: IBarnRespons = {
        ident: '10987654321',
        navn: 'Ole Duck',
        borMedSøker: true,
        fødselsdato: '2020-10-17',
        adressebeskyttelse: false,
    };

    return { ...standardVerdi, ...props };
}

export function barnFixture(props: Partial<IBarn> = {}): IBarn {
    const standardVerdi: IBarn = {
        ident: '10987654321',
        adressebeskyttelse: false,
        id: '123456789',
        navn: 'Ole Duck',
        borMedSøker: true,
        alder: '1',
    };

    return { ...standardVerdi, ...props };
}

export function søkerResponsFixture(props: Partial<ISøkerRespons> = {}): ISøkerRespons {
    const standardVerdi: ISøkerRespons = {
        ident: '12345678910',
        adresse: {
            adressenavn: 'Apalveien',
            postnummer: '0678',
            husbokstav: null,
            bruksenhetsnummer: null,
            husnummer: '111',
            poststed: 'Oslo',
        },
        barn: [
            barnResponsFixture(),
            barnResponsFixture({ ident: '11987654321', navn: 'Dole Duck' }),
            barnResponsFixture({ ident: '12987654321', navn: 'Doffen Duck' }),
        ],
        sivilstand: { type: ESivilstand.GIFT },
        statsborgerskap: [{ landkode: 'NLD' }],
        navn: 'Donald Duck',
        adressebeskyttelse: false,
    };

    return { ...standardVerdi, ...props };
}

export function mockDataFixture(
    props: Partial<ApiRessurs<ISøkerRespons>> = {}
): ApiRessurs<ISøkerRespons> {
    const standardVerdi: ApiRessurs<ISøkerRespons> = {
        data: søkerResponsFixture(),
        melding: 'Innhenting av data var vellykket',
        status: RessursStatus.SUKSESS,
        frontendFeilmelding: null,
        stacktrace: null,
    };

    return { ...standardVerdi, ...props };
}
