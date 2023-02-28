import React from 'react';

import styled from 'styled-components';

import { Typografi } from '../../../typer/common';
import { TypografiWrapper } from '../TekstBlock';

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
                <TypografiWrapper typografi={Typografi.HeadingH2}>{tittel}</TypografiWrapper>
            )}
            <InformasjonsbolkChildrenWrapper>{children}</InformasjonsbolkChildrenWrapper>
        </InformasjonsbolkContainer>
    );
};

export default Informasjonsbolk;
