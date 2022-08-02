import React from 'react';

import styled from 'styled-components';

const Container = styled.div<{ inline: boolean }>`
    && {
        margin-bottom: ${props => (props.inline ? '2rem' : '4rem')};
    }

    > div :not(:last-child) {
        margin-bottom: 2rem;
    }
`;

const KomponentGruppe: React.FC<{
    className?: string;
    inline?: boolean;
    dynamisk?: boolean;
}> = ({ className, inline = false, dynamisk = false, children }) => {
    return (
        <Container inline={inline} className={className} aria-live={dynamisk ? 'polite' : 'off'}>
            {React.Children.map(children, child => {
                return child && <div>{child}</div>;
            })}
        </Container>
    );
};

export default KomponentGruppe;
