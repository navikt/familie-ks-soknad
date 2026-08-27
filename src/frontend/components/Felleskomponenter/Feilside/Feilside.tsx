import { Box } from '@navikt/ds-react';
import { type FC, useEffect } from 'react';

import { useSpråkContext } from '../../../context/SpråkContext';
import { FeilsideInnhold } from './FeilsideInnhold';

export const Feilside: FC = () => {
    const { visSpråkvelger } = useSpråkContext();

    useEffect(() => {
        visSpråkvelger();
    }, []);

    return (
        <Box marginBlock="space-128">
            <FeilsideInnhold />
        </Box>
    );
};
