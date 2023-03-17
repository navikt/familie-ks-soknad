import React from 'react';

import { Navigate } from 'react-router-dom';

import { useApp } from '../../../context/AppContext';

interface RedirectTilStartProps {
    // eslint-disable-next-line
    component: React.ComponentType<any>;
}
const RedirectTilStart: React.FC<RedirectTilStartProps> = ({ component: Component }) => {
    const { sisteUtfylteStegIndex, fåttGyldigKvittering } = useApp();

    return sisteUtfylteStegIndex === -1 && !fåttGyldigKvittering ? (
        <Navigate to={'/'} replace />
    ) : (
        <Component />
    );
};

export default RedirectTilStart;
