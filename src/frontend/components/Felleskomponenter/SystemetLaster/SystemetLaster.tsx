import React from 'react';

import { BodyShort, Loader, VStack } from '@navikt/ds-react';

const SystemetLaster = () => {
    return (
        <main>
            <VStack height="100vh" justify="center" align="center">
                <BodyShort spacing>Søknaden laster</BodyShort>
                <Loader size={'3xlarge'} />
            </VStack>
        </main>
    );
};

export default SystemetLaster;
