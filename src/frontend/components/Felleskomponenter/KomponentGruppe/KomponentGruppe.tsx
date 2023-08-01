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

    > div :not(:last-child) {
        margin-bottom: 2rem;
    }
`;

function KomponentGruppe({ className, inline = false, dynamisk = false, children }: Props) {
    return (
        <Container inline={inline} className={className} aria-live={dynamisk ? 'polite' : 'off'}>
            {React.Children.map(children, child => {
                return child && <div>{child}</div>;
            })}
        </Container>
    );
}

export default KomponentGruppe;
