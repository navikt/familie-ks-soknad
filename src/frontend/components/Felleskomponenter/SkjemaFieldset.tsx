import React, { ReactNode } from 'react';

import { Fieldset, VStack } from '@navikt/ds-react';

interface Props {
    legend: ReactNode;
    dynamisk?: boolean;
    children?: ReactNode;
}

function SkjemaFieldset({ legend, dynamisk = false, children }: Props) {
    return (
        <Fieldset aria-live={dynamisk ? 'polite' : 'off'} legend={legend}>
            <VStack gap="10">{children}</VStack>
        </Fieldset>
    );
}

export default SkjemaFieldset;
