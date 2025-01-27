import React, { useEffect, useRef, useState } from 'react';

import { useLocation } from 'react-router';

export const ScrollHandler: React.FC = () => {
    const { hash } = useLocation();
    const [sjekketGanger, settSjekketGanger] = useState(0);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    const scrollTilFelt = (): boolean => {
        const feltId = hash.substr(hash.lastIndexOf('#') + 1);
        const element = document.getElementById(feltId);
        if (element) {
            element.scrollIntoView();
        }
        return !!element;
    };

    const clearTimer = () => {
        if (timer.current) {
            clearInterval(timer.current);
        }
        timer.current = null;
    };

    const createTimer = () => {
        // Vi bør være helt sikre på at vi ikke restarter scrollhandleren når den har gjort sitt
        if (sjekketGanger > 0) {
            return timer.current;
        }
        return (
            timer.current ??
            setInterval(() => {
                if (scrollTilFelt()) {
                    clearTimer();
                }
                if (sjekketGanger >= 5) {
                    clearTimer();
                }
                settSjekketGanger(sjekketGanger + 1);
            }, 100)
        );
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // Hvis vi har hash i path, sett opp en timer som venter på at feltet blir synlig
        timer.current = hash ? createTimer() : null;
        return clearTimer;
    }, []);

    return <></>;
};
