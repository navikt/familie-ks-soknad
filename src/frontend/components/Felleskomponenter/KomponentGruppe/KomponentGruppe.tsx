import { VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';

interface Props {
    className?: string;
    dynamisk?: boolean;
    children?: ReactNode;
}

function KomponentGruppe({ dynamisk = false, children }: Props) {
    if (!children) {
        return null;
    }
    return (
        <VStack gap="space-16" aria-live={dynamisk ? 'polite' : 'off'}>
            {children}
        </VStack>
    );
}

export default KomponentGruppe;
