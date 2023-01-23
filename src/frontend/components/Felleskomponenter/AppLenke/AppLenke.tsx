import React, { MouseEventHandler } from 'react';

import { useHistory } from 'react-router-dom';

import Lenke from 'nav-frontend-lenker';

import { basePath } from '../../../../shared-utils/Miljø';
import { unslash } from '../../../../shared-utils/unslash';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import { ISteg } from '../../../typer/routes';

interface Props {
    steg: ISteg;
    hash?: string;
    returnTo?: ISteg;
}

export const AppLenke: React.FC<Props> = ({ steg, hash, returnTo, children }) => {
    const { push: pushHistory } = useHistory();
    const { settKomFra } = useAppNavigation();

    const clickHandler: MouseEventHandler = event => {
        event.preventDefault();
        returnTo && settKomFra(returnTo);
        pushHistory({
            pathname: steg.path,
            hash,
        });
    };

    return (
        <Lenke
            href={basePath + unslash(steg.path) + (hash ? '#' + hash : '')}
            rel="noopener noreferrer"
            onClick={clickHandler}
        >
            {children}
        </Lenke>
    );
};
