import { Navigate } from 'react-router';

import { useAppContext } from '../../../context/AppContext';

interface RedirectTilStartProps {
    component: React.ComponentType<any>;
}
const RedirectTilStart: React.FC<RedirectTilStartProps> = ({ component: Component }) => {
    const { sisteUtfylteStegIndex, fåttGyldigKvittering } = useAppContext();

    return sisteUtfylteStegIndex === -1 && !fåttGyldigKvittering ? <Navigate to={'/'} replace /> : <Component />;
};

export default RedirectTilStart;
