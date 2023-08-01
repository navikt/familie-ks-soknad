import React, { ReactNode } from 'react';

import styled from 'styled-components';

interface Props {
    tittel: ReactNode;
    dynamisk?: boolean;
    children?: ReactNode;
}

const Container = styled.fieldset`
    border: none;
    padding: 0;

    && {
        margin-bottom: 4rem;
    }

    > div :not(:last-child) {
        margin-bottom: 1.5rem;
    }
`;

function SkjemaFieldset({ tittel, dynamisk = false, children }: Props) {
    return (
        <Container aria-live={dynamisk ? 'polite' : 'off'}>
            {tittel}
            {React.Children.map(children, child => {
                return child && <div>{child}</div>;
            })}
        </Container>
    );
}

export default SkjemaFieldset;
