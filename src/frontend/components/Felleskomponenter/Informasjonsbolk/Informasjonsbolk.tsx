import React, { ReactNode } from 'react';

import { Typografi } from '../../../typer/common';
import { TypografiWrapper } from '../TekstBlock';

export interface IInformasjonsbolkProps {
    tittel?: string;
    children?: ReactNode;
}

function Informasjonsbolk({ tittel, children, ...props }: IInformasjonsbolkProps) {
    return (
        <div {...props}>
            {tittel && (
                <TypografiWrapper typografi={Typografi.HeadingH2}>{tittel}</TypografiWrapper>
            )}
            <div>{children}</div>
        </div>
    );
}

export default Informasjonsbolk;
