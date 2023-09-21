import { useState } from 'react';

const useModal = () => {
    const [modalÅpen, settModalÅpen] = useState<boolean>(false);
    const toggleModal = () => {
        settModalÅpen(!modalÅpen);
    };
    const lukkModal = () => {
        settModalÅpen(false);
    };
    const åpneModal = () => {
        settModalÅpen(true);
    };
    return { erÅpen: modalÅpen, toggleModal, lukkModal, åpneModal };
};

export default useModal;
