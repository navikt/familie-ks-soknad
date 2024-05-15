import React from 'react';

import { BodyShort } from '@navikt/ds-react';
import { LocaleType } from '@navikt/familie-sprakvelger';

import AlertStripe from '../AlertStripe/AlertStripe';
import { useSpråk } from '../Dekoratøren/SpråkContext';

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
            <AlertStripe variant="error" aria-live={'polite'}>
                <BodyShort>{feilsidetekstPåRiktigSpråk()}</BodyShort>
            </AlertStripe>
        </div>
    );
};
