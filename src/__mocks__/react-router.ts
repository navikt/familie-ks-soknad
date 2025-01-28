import { mockedHistory } from '../frontend/utils/testing';
const reactRouter = jest.requireActual('react-router');

const useLocation = () => {
    return {
        pathname: mockedHistory[mockedHistory.length - 1],
    };
};

const useNavigate = () => (to: string) => {
    mockedHistory.push(to);
};

module.exports = {
    ...reactRouter,
    useLocation,
    useNavigate,
};
