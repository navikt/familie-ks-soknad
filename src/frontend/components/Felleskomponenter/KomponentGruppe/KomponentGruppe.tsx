import React, { ReactNode } from 'react';

import styled from 'styled-components';

interface Props {
    className?: string;
    inline?: boolean;
    dynamisk?: boolean;
    children?: ReactNode;
}

const Container = styled.div<{ inline: boolean }>`
    && {
        margin-bottom: ${props => (props.inline ? '2rem' : '4rem')};
    }
`;

const ChildContainer = styled.div`
    margin-bottom: 2rem;
`;

function KomponentGruppe({ className, inline = false, dynamisk = false, children }: Props) {
    const childrenLengde = React.Children.count(children);

    return (
        <Container inline={inline} className={className} aria-live={dynamisk ? 'polite' : 'off'}>
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

export default KomponentGruppe;
