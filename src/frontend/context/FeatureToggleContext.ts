import { useState } from 'react';

import createUseContext from 'constate';

import { Ressurs, RessursStatus } from '@navikt/familie-typer';

import { useLastRessurserContext } from './LastRessurserContext';
import { basePath } from '../../shared-utils/Miljø';
import useFørsteRender from '../hooks/useFørsteRender';
import { EAllFeatureToggles, defaultFeatureToggleValues } from '../typer/feature-toggles';

const [FeatureTogglesProvider, useFeatureToggles] = createUseContext(() => {
    const { axiosRequest } = useLastRessurserContext();

    const [toggles, setToggles] = useState<EAllFeatureToggles>(defaultFeatureToggleValues);

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
