import React from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

export interface IInformasjonsbolkProps {
    tittel?: string;
}

const InformasjonsbolkContainer = styled.div`
    margin-top: 2rem;
`;

const InformasjonsbolkChildrenWrapper = styled.div`
    margin-top: 1.125rem;
`;

const Informasjonsbolk: React.FC<IInformasjonsbolkProps> = ({ tittel, children, ...props }) => {
    return (
        <InformasjonsbolkContainer {...props}>
            {tittel && (
                <Heading level={'2'} size={'xsmall'}>
                    {tittel}
                </Heading>
            )}
            <InformasjonsbolkChildrenWrapper>{children}</InformasjonsbolkChildrenWrapper>
        </InformasjonsbolkContainer>
    );
};

export default Informasjonsbolk;
