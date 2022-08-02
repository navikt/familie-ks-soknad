import { useState } from 'react';

import createUseContext from 'constate';

import { Ressurs, RessursStatus } from '@navikt/familie-typer';

import useFørsteRender from '../hooks/useFørsteRender';
import { basePath } from '../Miljø';
import { EAllFeatureToggles } from '../typer/feature-toggles';
import { useLastRessurserContext } from './LastRessurserContext';

const [FeatureTogglesProvider, useFeatureToggles] = createUseContext(() => {
    const { axiosRequest } = useLastRessurserContext();
    /**
     * Husk å legge til nye toggles i funksjon konfigurerAllFeatureTogglesEndpoint (feature-toggles.ts)
     */
    const [toggles, setToggles] = useState<EAllFeatureToggles>({
        //[EFeatureToggle.EXAMPLE]: false,
    });

    useFørsteRender(async () => {
        const allFeatureToggles: Ressurs<EAllFeatureToggles> = await axiosRequest<
            EAllFeatureToggles,
            void
        >({
            url: `${basePath}toggles/all`,
        });

        if (allFeatureToggles.status === RessursStatus.SUKSESS) {
            setToggles(allFeatureToggles.data);
        }
    });

    return {
        toggles,
    };
});

export { FeatureTogglesProvider, useFeatureToggles };
