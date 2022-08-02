import { useState } from 'react';

const useModal = () => {
    const [modalÅpen, settModalÅpen] = useState<boolean>(false);
    const toggleModal = () => {
        settModalÅpen(!modalÅpen);
    };
    return { erÅpen: modalÅpen, toggleModal };
};

export default useModal;
