import React from 'react';

import AlertStripe from '../AlertStripe/AlertStripe';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

export const Feilside: React.FC = () => {
    return (
        <div>
            <AlertStripe variant="error" aria-live={'polite'}>
                <SpråkTekst id={'felles.crashmelding'} />
            </AlertStripe>
        </div>
    );
};
