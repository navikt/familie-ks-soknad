import React from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { useSpråk } from '../../../context/SpråkContext';
import { LocaleType } from '../../../typer/common';

export const Feilside: React.FC = () => {
    const { valgtLocale } = useSpråk();

    const feilsidetekstPåRiktigSpråk = () => {
        switch (valgtLocale) {
            case LocaleType.nb:
                return 'En feil har oppstått! Vennligst prøv igjen. Hvis det fremdeles er problem må du bruke PDF/papir-skjema for å søke.';
            case LocaleType.nn:
                return 'Ein feil har oppstått! Ver venleg og prøv igjen. Dersom det framleis er problem må du bruke PDF/papir-skjema for å søke.';
            case LocaleType.en:
                return 'An error has occurred. Please try again. If the problem persists, you will need to apply using a PDF/paper application form.';
        }
    };

    return (
        <div>
            <Alert variant="error" inline aria-live={'polite'}>
                <BodyShort>{feilsidetekstPåRiktigSpråk()}</BodyShort>
            </Alert>
        </div>
    );
};
