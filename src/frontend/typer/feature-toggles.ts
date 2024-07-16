export enum EToggle {
    KONTANTSTOTTE = 'familie-ks-soknad.disable-soknad',
}

export enum EFeatureToggle {
    VIS_GUIDE_I_STEG = 'VIS_GUIDE_I_STEG',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    [EFeatureToggle.VIS_GUIDE_I_STEG]: 'familie-ks-soknad.vis-guide-i-steg',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
