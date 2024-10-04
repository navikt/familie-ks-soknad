import React, { ReactNode } from 'react';

import { VStack } from '@navikt/ds-react';

interface Props {
    className?: string;
    dynamisk?: boolean;
    children?: ReactNode;
}

function KomponentGruppe({ dynamisk = false, children }: Props) {
    return (
        children && (
            <VStack gap="4" aria-live={dynamisk ? 'polite' : 'off'}>
                {children}
            </VStack>
        )
    );
}

export default KomponentGruppe;
