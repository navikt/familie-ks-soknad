import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Undertittel } from 'nav-frontend-typografi';

import SpråkTekst from './SpråkTekst/SpråkTekst';

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

const StyledLegend = styled.legend`
    margin-bottom: 1.5rem;
`;

const SkjemaFieldset: React.FC<{
    /** @deprecated **/
    tittelId?: string;
    tittel?: ReactNode; //todo: fjern optional når tittelId fjernes
    språkValues?: { [key: string]: ReactNode };
    dynamisk?: boolean;
    id?: string;
}> = ({ tittelId, tittel, språkValues, dynamisk = false, id, children }) => {
    return (
        <Container aria-live={dynamisk ? 'polite' : 'off'}>
            {tittelId && (
                <StyledLegend id={id}>
                    <Undertittel>
                        <SpråkTekst id={tittelId} values={språkValues} />
                    </Undertittel>
                </StyledLegend>
            )}
            {tittel}
            {React.Children.map(children, child => {
                return child && <div>{child}</div>;
            })}
        </Container>
    );
};

export default SkjemaFieldset;
