import { useState } from 'react';

const useModal = () => {
    const [modalÅpen, settModalÅpen] = useState<boolean>(false);
    const lukkModal = () => {
        settModalÅpen(false);
    };
    const åpneModal = () => {
        settModalÅpen(true);
    };
    return { erÅpen: modalÅpen, lukkModal, åpneModal };
};

export default useModal;
