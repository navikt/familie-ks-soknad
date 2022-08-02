import React from 'react';

import styled from 'styled-components';

import NavFrontendChevron from 'nav-frontend-chevron';

interface Props {
    controlsId: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle: () => void;
}

const StyledButton = styled.button`
    border: none;
    background: transparent;
    padding: 0;
    outline: none;
    cursor: pointer;

    &:hover {
        outline: none;
        .infoToggleButton__content {
            border-bottom-color: transparent;
        }
    }
    &:focus,
    &:active {
        .infoToggleButton__content {
            outline: none;
            color: white;
            text-decoration: none;
            background-color: #254b6d;
            box-shadow: 0 0 0 2px #254b6d;
            border-bottom-color: transparent;
        }
    }
`;

const ButtonInnholdWrapper = styled.span`
    color: #0067c5;
    display: inline-block;
    text-align: left;
    border-bottom: solid 1px #b7b1a9;
    padding-right: 1.5rem;
    position: relative;
`;

const ChevronContainer = styled.span`
    position: absolute;
    right: 0;
    .nav-frontend-chevron {
        margin-left: 0.4rem;
    }
`;

const LabelContainer = styled.span`
    display: inline-block;
`;

const InfoToggleButton = (props: Props) => {
    const { isOpen = false, children, onToggle, controlsId } = props;
    return (
        <StyledButton
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={controlsId}
        >
            <ButtonInnholdWrapper>
                <LabelContainer>{children}</LabelContainer>
                <ChevronContainer>
                    <NavFrontendChevron type={isOpen ? 'opp' : 'ned'} />
                </ChevronContainer>
            </ButtonInnholdWrapper>
        </StyledButton>
    );
};

export default InfoToggleButton;
