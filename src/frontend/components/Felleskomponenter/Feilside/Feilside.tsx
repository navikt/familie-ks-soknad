import React from 'react';

import { useApp } from '../../../context/AppContext';
import AlertStripe from '../AlertStripe/AlertStripe';
import TekstBlock from '../TekstBlock';

export const Feilside: React.FC = () => {
    const { tekster } = useApp();
    const { enFeilHarOppstaatt } = tekster().FELLES.kanIkkeBrukeSoeknad;
    return (
        <div>
            <AlertStripe variant="error" aria-live={'polite'}>
                <TekstBlock block={enFeilHarOppstaatt} />
            </AlertStripe>
        </div>
    );
};
