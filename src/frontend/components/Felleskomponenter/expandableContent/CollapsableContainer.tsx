import React from 'react';

import { Collapse } from 'react-collapse';
import { css } from 'styled-components';
import styled from 'styled-components';

export interface Props {
    children: React.ReactNode;
    isOpen?: boolean;
    ariaLive?: 'assertive' | 'polite' | 'off';
    animated?: boolean;
}

const StyledCollapse = styled(Collapse)<{ isOpened }>`
    opacity: 0;
    transition: opacity 0.5s ease;

    .typo-element {
        margin-bottom: 0.5rem;
    }

    ${props =>
        props.isOpened &&
        css`
            opacity: 1;
            margin-bottom: 1.5rem;
        `}
`;

const CollapsableContainer = ({
    children,
    animated = true,
    isOpen = false,
    ariaLive = 'off',
}: Props) => {
    const content = <div aria-live={ariaLive}>{isOpen ? <div>{children}</div> : <div />}</div>;
    if (!animated) {
        return content;
    }
    return <StyledCollapse isOpened={isOpen}>{content}</StyledCollapse>;
};

export default CollapsableContainer;
