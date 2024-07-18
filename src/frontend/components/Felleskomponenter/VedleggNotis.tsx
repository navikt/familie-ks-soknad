import React from 'react';

import { Alert, BodyShort, Box } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import { useFeatureToggles } from '../../context/FeatureToggleContext';
import { LocaleRecordBlock } from '../../typer/common';
import { FlettefeltVerdier } from '../../typer/kontrakt/generelle';
import { ESanitySteg } from '../../typer/sanity/sanity';

import TekstBlock from './TekstBlock';

export const VedleggNotis: React.FC<{
    block: LocaleRecordBlock;
    flettefelter?: FlettefeltVerdier;
    dynamisk?: boolean;
}> = ({ block, flettefelter, dynamisk = false }) => {
    const { tekster, plainTekst } = useApp();
    const { toggles } = useFeatureToggles();

    const dokumentasjonTekster = tekster()[ESanitySteg.DOKUMENTASJON];
    const { lastOppSenereISoknad } = dokumentasjonTekster;

    return (
        <Alert variant="info" aria-live={dynamisk ? 'polite' : 'off'}>
            <TekstBlock block={block} flettefelter={flettefelter} />
            {toggles.NYE_VEDLEGGSTEKSTER && (
                <Box marginBlock="4 0">
                    <BodyShort>{plainTekst(lastOppSenereISoknad)}</BodyShort>
                </Box>
            )}
        </Alert>
    );
};
