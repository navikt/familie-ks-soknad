import React, { FC, useEffect } from 'react';

import { Box } from '@navikt/ds-react';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import InnholdContainer from '../InnholdContainer/InnholdContainer';

import { FeilsideInnhold } from './FeilsideInnhold';

export const Feilside: FC = () => {
    useEffect(() => {
        visSpråkvelger();
    }, []);

    const visSpråkvelger = () => {
        setAvailableLanguages([
            { locale: 'nb', handleInApp: true },
            { locale: 'nn', handleInApp: true },
            { locale: 'en', handleInApp: true },
        ]).then();
    };

    return (
        <InnholdContainer>
            <Box marginBlock="32">
                <FeilsideInnhold />
            </Box>
        </InnholdContainer>
    );
};
