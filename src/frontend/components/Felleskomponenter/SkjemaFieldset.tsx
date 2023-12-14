import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Fieldset } from '@navikt/ds-react';

interface Props {
    legend: ReactNode;
    dynamisk?: boolean;
    children?: ReactNode;
}

const StyledFieldset = styled(Fieldset)`
    && {
        margin-bottom: 4rem;
    }
`;

const ChildContainer = styled.div`
    margin-bottom: 1.5rem;
`;

function SkjemaFieldset({ legend, dynamisk = false, children }: Props) {
    const childrenLengde = React.Children.count(children);

    return (
        <StyledFieldset aria-live={dynamisk ? 'polite' : 'off'} legend={legend}>
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
        </StyledFieldset>
    );
}

export default SkjemaFieldset;
