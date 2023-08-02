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
`;

const ChildContainer = styled.div`
    margin-bottom: 1.5rem;
`;

function SkjemaFieldset({ tittel, dynamisk = false, children }: Props) {
    const childrenLengde = React.Children.count(children);

    return (
        <Container aria-live={dynamisk ? 'polite' : 'off'}>
            {tittel}
            {React.Children.map(children, (child, index) => {
                return (
                    child &&
                    (index + 1 !== childrenLengde ? (
                        <ChildContainer>{child}</ChildContainer>
                    ) : (
                        <div>{child}</div>
                    ))
                );
            })}
        </Container>
    );
}

export default SkjemaFieldset;
