import { mockedHistory } from '../frontend/utils/testing';
const reactRouterDom = jest.requireActual('react-router-dom');

const useLocation = () => {
    return {
        pathname: mockedHistory[mockedHistory.length - 1],
    };
};

const useNavigate = () => (to: string) => {
    mockedHistory.push(to);
};

module.exports = {
    ...reactRouterDom,
    useLocation,
    useNavigate,
};
