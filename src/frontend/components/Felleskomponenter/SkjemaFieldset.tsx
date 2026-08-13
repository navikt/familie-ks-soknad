import { Fieldset, VStack } from '@navikt/ds-react';
import React, { type ReactNode } from 'react';

interface Props {
    legend: ReactNode;
    dynamisk?: boolean;
    children?: ReactNode;
}

function SkjemaFieldset({ legend, dynamisk = false, children }: Props) {
    return (
        <Fieldset aria-live={dynamisk ? 'polite' : 'off'} legend={legend}>
            <VStack gap="space-40">{children}</VStack>
        </Fieldset>
    );
}

export default SkjemaFieldset;
