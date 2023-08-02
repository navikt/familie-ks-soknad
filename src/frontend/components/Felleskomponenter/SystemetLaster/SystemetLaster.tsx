import React from 'react';

import styled from 'styled-components';

import { BodyShort, Loader } from '@navikt/ds-react';

const StyledLoader = styled(Loader)`
    margin-top: 3rem;
    height: 10rem;
    width: 10rem;
`;

const StyledMain = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
`;

const SystemetLaster = () => {
    return (
        <StyledMain>
            <BodyShort>Søknaden laster</BodyShort>
            <StyledLoader transparent size={'2xlarge'} />
        </StyledMain>
    );
};

export default SystemetLaster;
