import React from 'react';

import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';

import { useApp } from '../../../context/AppContext';

interface RedirectTilStartProps extends RouteProps {
    // eslint-disable-next-line
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}
const RedirectTilStart: React.FC<RedirectTilStartProps> = ({ component: Component, ...rest }) => {
    const { sisteUtfylteStegIndex, fåttGyldigKvittering } = useApp();

    return (
        <Route
            {...rest}
            render={props =>
                sisteUtfylteStegIndex === -1 && !fåttGyldigKvittering ? (
                    <Redirect to={'/'} />
                ) : (
                    <Component {...props} />
                )
            }
        />
    );
};

export default RedirectTilStart;
