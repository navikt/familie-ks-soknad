import React from 'react';

import styled from 'styled-components';

import { BodyShort, Loader } from '@navikt/ds-react';

const StyledLoader = styled(Loader)`
    margin-top: 3rem;
    height: 10rem;
    width: 10rem;
`;

const SystemetLaster = () => {
    return (
        <main className={'systemet-laster'}>
            <div className={'systemet-laster__content'}>
                <BodyShort
                    className={'systemet-laster__content--tekst'}
                    children={'Søknaden laster'}
                />
                <StyledLoader transparent size={'2xlarge'} />
            </div>
        </main>
    );
};

export default SystemetLaster;
