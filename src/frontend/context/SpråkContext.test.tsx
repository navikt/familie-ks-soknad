import React from 'react';

import { render, screen } from '@testing-library/react';
import { Cookies, CookiesProvider } from 'react-cookie';

import '@testing-library/jest-dom';

import { SpråkProvider, useSpråkContext } from './SpråkContext';

const Eksempelkomponent = () => {
    const { valgtLocale } = useSpråkContext();

    return <span>Språket er: {valgtLocale}</span>;
};

test('Kan hente ut valgt locale fra SpråkContext når den er satt av dekoratøren', () => {
    const cookies = new Cookies();
    cookies.set('decorator-language', 'en');

    render(
        <CookiesProvider cookies={cookies}>
            <SpråkProvider>
                <Eksempelkomponent />
            </SpråkProvider>
        </CookiesProvider>
    );
    expect(screen.getByText(/^Språket er:/)).toHaveTextContent('Språket er: en');
});
