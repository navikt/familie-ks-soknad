import React from 'react';

import { render, screen } from '@testing-library/react';
import { Cookies, CookiesProvider } from 'react-cookie';

import '@testing-library/jest-dom';

import { SpråkProvider, useSpråk } from './SpråkContext';

test('Kan hente ut valgt locale fra SpråkContext som defaultes til "nb" hvis dekoratøren ikke har satt en egen', () => {
    const Eksempelkomponent = () => {
        const { valgtLocale } = useSpråk();

        return <span>Språket er: {valgtLocale}</span>;
    };
    render(
        <SpråkProvider>
            <Eksempelkomponent />
        </SpråkProvider>
    );
    expect(screen.getByText(/^Språket er:/)).toHaveTextContent('Språket er: nb');
});

test('Kan hente ut valgt locale fra SpråkContext når den er satt av dekoratøren', () => {
    const cookies = new Cookies();
    cookies.set('decorator-language', 'en');

    const Eksempelkomponent = () => {
        const { valgtLocale } = useSpråk();

        return <span>Språket er: {valgtLocale}</span>;
    };
    render(
        <CookiesProvider cookies={cookies}>
            <SpråkProvider>
                <Eksempelkomponent />
            </SpråkProvider>
        </CookiesProvider>
    );
    expect(screen.getByText(/^Språket er:/)).toHaveTextContent('Språket er: en');
});
