import React, { MouseEventHandler, ReactNode } from 'react';

import { useNavigate } from 'react-router';

import { Link } from '@navikt/ds-react';

import { basePath } from '../../../../shared-utils/Miljø';
import { unslash } from '../../../../shared-utils/unslash';
import { useAppNavigationContext } from '../../../context/AppNavigationContext';
import { ISteg } from '../../../typer/routes';

interface Props {
    steg: ISteg;
    hash?: string;
    returnTo?: ISteg;
    children?: ReactNode;
}

export function AppLenke({ steg, hash, returnTo, children }: Props) {
    const navigate = useNavigate();
    const { settKomFra } = useAppNavigationContext();

    const clickHandler: MouseEventHandler = event => {
        event.preventDefault();
        if (returnTo) {
            settKomFra(returnTo);
        }
        navigate({
            pathname: steg.path,
            hash,
        });
    };

    return (
        <Link
            href={basePath + unslash(steg.path) + (hash ? '#' + hash : '')}
            rel="noopener noreferrer"
            onClick={clickHandler}
        >
            {children}
        </Link>
    );
}
