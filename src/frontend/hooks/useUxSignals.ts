import { getCurrentConsent } from '@navikt/nav-dekoratoren-moduler';
import { useEffect } from 'react';

const useUxSignals = (ready: boolean) => {
    useEffect(() => {
        const consent = getCurrentConsent();
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://widget.uxsignals.com/embed.js';
        if (consent && consent.consent.surveys && ready) {
            document.body.appendChild(script);
        }

        return () => {
            try {
                document.body.removeChild(script);
            } catch {
                /* empty */
            }
        };
    }, [ready]);
};

export default useUxSignals;
