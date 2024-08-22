import React, { FC, useEffect } from 'react';

import { Box } from '@navikt/ds-react';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import InnholdContainer from '../InnholdContainer/InnholdContainer';

import { FeilsideHeading } from './FeilsideHeading';
import { FeilsideInnhold } from './FeilsideInnhold';
import { FeilsideStatuskode } from './FeilsideStatuskode';

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

    // TODO: Er det mulig å få andre statuskoder enn 500? Hvis ja, hvordan finner vi dem og viser det her på feilsiden?
    const statuskode = '500';

    return (
        <InnholdContainer>
            <Box marginBlock="32">
                <FeilsideStatuskode statuskode={statuskode} />
                <FeilsideHeading />
                <FeilsideInnhold />
            </Box>
        </InnholdContainer>
    );
};
