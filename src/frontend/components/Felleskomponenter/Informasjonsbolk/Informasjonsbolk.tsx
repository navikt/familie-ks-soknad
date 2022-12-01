import React from 'react';

import styled from 'styled-components';

import { Undertittel } from 'nav-frontend-typografi';

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
            {tittel && <Undertittel>{tittel}</Undertittel>}
            <InformasjonsbolkChildrenWrapper>{children}</InformasjonsbolkChildrenWrapper>
        </InformasjonsbolkContainer>
    );
};

export default Informasjonsbolk;
