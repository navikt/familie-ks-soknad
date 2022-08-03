import '@testing-library/jest-dom';
import MockAdapter from 'axios-mock-adapter';
import IntlPolyfill from 'intl';

import { RessursStatus } from '@navikt/familie-typer';

import { preferredAxios } from './frontend/context/axios';

window.scrollTo = () => {
    // Ikke implementert
};

process.env.BASE_PATH = '/';
global.Intl = IntlPolyfill;

const axiosMock = new MockAdapter(preferredAxios);

axiosMock.onGet(/\/api\/innlogget/).reply(200, {
    status: RessursStatus.SUKSESS,
    data: 'Autentisert kall',
});

// Data uviktig, mockes alltid med med spyOnUseApp
axiosMock.onPost(/\/api\/personopplysning/).reply(200, {
    status: RessursStatus.SUKSESS,
    data: { barn: [] },
});

// Mellomlagring, lat som at det går igjennom, men ikke returner data slik at vi skipper en callback
axiosMock.onAny(/:8082/).reply(200);

axiosMock.onPost();
