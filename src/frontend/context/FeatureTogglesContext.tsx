import { createContext, type PropsWithChildren, useContext } from 'react';

import { defaultFeatureToggleValues, type EAllFeatureToggles } from '../../common/feature-toggles';

export interface FeatureTogglesContext {
    toggles: EAllFeatureToggles;
}

const FeatureTogglesContext = createContext<FeatureTogglesContext | undefined>(undefined);

interface Props extends PropsWithChildren {
    toggles?: EAllFeatureToggles;
}

export function FeatureTogglesProvider({ toggles = defaultFeatureToggleValues, children }: Props) {
    return <FeatureTogglesContext.Provider value={{ toggles }}>{children}</FeatureTogglesContext.Provider>;
}

export function useFeatureToggles() {
    const context = useContext(FeatureTogglesContext);
    if (context === undefined) {
        throw new Error('useFeatureToggles må brukes innenfor FeatureTogglesProvider');
    }
    return context;
}
