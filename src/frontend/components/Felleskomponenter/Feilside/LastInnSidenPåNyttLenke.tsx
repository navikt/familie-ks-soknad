import React, { FC, ReactNode } from 'react';

import { Link } from '@navikt/ds-react';

import { useSteg } from '../../../context/StegContext';

interface ILastInnSidenPåNyttLenkeProps {
    children: ReactNode;
}

export const LastInnSidenPåNyttLenke: FC<ILastInnSidenPåNyttLenkeProps> = ({ children }) => {
    const { hentNåværendeSteg } = useSteg();
    const nåværendeSteg = hentNåværendeSteg();

    const håndterLastInnPåNytt = (event: React.MouseEvent) => {
        event.preventDefault();
        location.reload();
    };

    return (
        <Link href={nåværendeSteg.path} variant="action" onClick={håndterLastInnPåNytt}>
            {children}
        </Link>
    );
};
