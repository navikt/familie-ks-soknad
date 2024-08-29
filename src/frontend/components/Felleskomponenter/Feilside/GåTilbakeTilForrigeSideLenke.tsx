import React, { FC, ReactNode } from 'react';

import { useNavigate } from 'react-router-dom';

import { Link } from '@navikt/ds-react';

import { useSteg } from '../../../context/StegContext';

interface IGåTilBakeTilForrigeSideLenkeProps {
    children: ReactNode;
}

export const GåTilBakeTilForrigeSideLenke: FC<IGåTilBakeTilForrigeSideLenkeProps> = ({
    children,
}) => {
    const navigate = useNavigate();
    const { hentForrigeSteg } = useSteg();
    const forrigeSteg = hentForrigeSteg();

    const handleNavigate = (event: React.MouseEvent) => {
        event.preventDefault();
        navigate(forrigeSteg.path);
    };

    return (
        <Link href={forrigeSteg.path} variant="action" onClick={handleNavigate}>
            {children}
        </Link>
    );
};
