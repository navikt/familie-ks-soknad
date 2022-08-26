import React, { useState } from 'react';

import { css } from 'styled-components';
import styled from 'styled-components';

import { guid } from 'nav-frontend-js-utils';
import { Normaltekst } from 'nav-frontend-typografi';

import AlertStripe from '../AlertStripe/AlertStripe';
import CollapsableContainer from './CollapsableContainer';
import InfoToggleButton from './InfoToggleButton';

interface Props {
    children: React.ReactNode;
    title?: string;
    closeTitle?: string;
    initialOpen?: boolean;
    filledBackground?: boolean;
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 100%;
    margin-bottom: 1rem;
`;

const ButtonContainer = styled.div<{ isOpen }>`
    width: 100%;

    ${props =>
        props.isOpen &&
        css`
            margin-bottom: 0.5rem;
        `}
`;

const InnholdContainer = styled.div`
    width: 100%;

    .ReactCollapse--collapse {
        transition: height 0.25s ease-in-out !important;
    }
`;

const ExpandableInfo = ({
    children,
    initialOpen,
    closeTitle,
    title,
    filledBackground = true,
}: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(initialOpen || false);
    const [toggleContentId] = useState(guid());

    return (
        <Container>
            <ButtonContainer isOpen={isOpen}>
                <InfoToggleButton
                    onToggle={() => setIsOpen(!isOpen)}
                    isOpen={isOpen}
                    controlsId={toggleContentId}
                >
                    <Normaltekst>{isOpen ? closeTitle || title : title}</Normaltekst>
                </InfoToggleButton>
            </ButtonContainer>
            <InnholdContainer id={toggleContentId}>
                <CollapsableContainer isOpen={isOpen} animated={true} ariaLive="polite">
                    {filledBackground ? (
                        <AlertStripe variant={'info'} inline={false}>
                            {children}
                        </AlertStripe>
                    ) : (
                        children
                    )}
                </CollapsableContainer>
            </InnholdContainer>
        </Container>
    );
};

export default ExpandableInfo;
