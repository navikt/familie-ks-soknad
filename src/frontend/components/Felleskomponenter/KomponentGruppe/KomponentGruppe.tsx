import React, { ReactNode } from 'react';

import { VStack } from '@navikt/ds-react';

interface Props {
    className?: string;
    inline?: boolean;
    dynamisk?: boolean;
    children?: ReactNode;
}

function KomponentGruppe({ children }: Props) {
    return children && <VStack gap="4">{children}</VStack>;
}

export default KomponentGruppe;
