import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Undertittel } from 'nav-frontend-typografi';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

export interface IInformasjonsbolkProps {
    tittelId?: string;
    språkValues?: { [key: string]: ReactNode };
}

const InformasjonsbolkContainer = styled.div`
    margin-top: 2rem;
`;

const InformasjonsbolkChildrenWrapper = styled.div`
    margin-top: 1.125rem;
`;

const Informasjonsbolk: React.FC<IInformasjonsbolkProps> = ({
    tittelId,
    språkValues,
    children,
    ...props
}) => {
    return (
        <InformasjonsbolkContainer {...props}>
            {tittelId && (
                <Undertittel>
                    <SpråkTekst id={tittelId} values={språkValues} />
                </Undertittel>
            )}
            <InformasjonsbolkChildrenWrapper>{children}</InformasjonsbolkChildrenWrapper>
        </InformasjonsbolkContainer>
    );
};

export default Informasjonsbolk;
