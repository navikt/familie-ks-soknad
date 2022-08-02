import React from 'react';

import Alertstripe from 'nav-frontend-alertstriper';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

export const Feilside: React.FC = () => {
    return (
        <div>
            <Alertstripe type="feil" aria-live={'polite'}>
                <SpråkTekst id={'felles.crashmelding'} />
            </Alertstripe>
        </div>
    );
};
