import React from 'react';

import styled from 'styled-components';

const Container = styled.div<{ inline: boolean; noMargin: boolean }>`
    && {
        margin-bottom: ${props => (props.inline ? '2rem' : '4rem')};
    }

    > div :not(:last-child) {
        margin-bottom: ${props => (props.noMargin ? '0rem' : '2rem')};
    }
`;

const KomponentGruppe: React.FC<{
    className?: string;
    inline?: boolean;
    dynamisk?: boolean;
    noMargin?: boolean;
}> = ({ className, inline = false, noMargin = false, dynamisk = false, children }) => {
    return (
        <Container
            inline={inline}
            noMargin={noMargin}
            className={className}
            aria-live={dynamisk ? 'polite' : 'off'}
        >
            {React.Children.map(children, child => {
                return child && <div>{child}</div>;
            })}
        </Container>
    );
};

export default KomponentGruppe;
