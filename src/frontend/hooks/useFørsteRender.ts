import { useEffect, useState } from 'react';

const useFørsteRender = (onFørsteRenderCallback: (...args: never[]) => void) => {
    const [førsteRender, settFørsteRender] = useState<boolean>(true);

    useEffect(() => {
        if (førsteRender) {
            onFørsteRenderCallback();
            settFørsteRender(false);
        }
    }, []);
};

export default useFørsteRender;
