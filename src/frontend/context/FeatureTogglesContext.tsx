import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import { type Ressurs, RessursStatus } from '@navikt/familie-typer';

import { BASE_PATH } from '../../shared-utils/miljø';
import useFørsteRender from '../hooks/useFørsteRender';
import { EAllFeatureToggles, defaultFeatureToggleValues } from '../typer/feature-toggles';

import { useLastRessurserContext } from './LastRessurserContext';

export interface FeatureTogglesContext {
    toggles: EAllFeatureToggles;
}

const FeatureTogglesContext = createContext<FeatureTogglesContext | undefined>(undefined);

export function FeatureTogglesProvider(props: PropsWithChildren) {
    const { axiosRequest } = useLastRessurserContext();

    const [toggles, setToggles] = useState<EAllFeatureToggles>(defaultFeatureToggleValues);

    useFørsteRender(async () => {
        const allFeatureToggles: Ressurs<EAllFeatureToggles> = await axiosRequest<EAllFeatureToggles, void>({
            url: `${BASE_PATH}toggles/all`,
        });

        if (allFeatureToggles.status === RessursStatus.SUKSESS) {
            setToggles(allFeatureToggles.data);
        }
    });

    return <FeatureTogglesContext.Provider value={{ toggles }}>{props.children}</FeatureTogglesContext.Provider>;
}

export function useFeatureToggles() {
    const context = useContext(FeatureTogglesContext);

    if (context === undefined) {
        throw new Error('useFeatureToggles må brukes innenfor FeatureTogglesProvider');
    }

    return context;
}
