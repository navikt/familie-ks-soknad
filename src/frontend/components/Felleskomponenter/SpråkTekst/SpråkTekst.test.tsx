import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { LocaleType } from '@navikt/familie-sprakvelger';

import SpråkTekst from './SpråkTekst';

test(`Test at kjente tags rendrer i språkkomponent`, () => {
    const tekster = {
        testtekst:
            'Dette er en test. {linjeskift} <b>Fet</b><punktliste><punkt>Listeelement</punkt></punktliste>',
    };

    render(
        <IntlProvider locale={LocaleType.nb} messages={tekster}>
            <SpråkTekst id={'testtekst'} />
        </IntlProvider>
    );

    ['b', 'br', 'ul', 'li'].forEach(støttaTag =>
        expect(document.querySelector(støttaTag)).toBeInTheDocument()
    );
});

test(`Test at ekstra tags kan legges til språkkomponent via props`, () => {
    const tekster = {
        testtekst: 'Dette er en test. {linjeskift} <b>Fet</b> <em>Kursiv</em>',
    };

    render(
        <IntlProvider locale={LocaleType.nb} messages={tekster}>
            <SpråkTekst
                id={'testtekst'}
                values={{
                    em: tekst => <em>{tekst}</em>,
                }}
            />
        </IntlProvider>
    );

    ['b', 'br', 'em'].forEach(støttaTag =>
        expect(document.querySelector(støttaTag)).toBeInTheDocument()
    );
});
