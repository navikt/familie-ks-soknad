export enum EToggle {
    KONTANTSTOTTE = 'familie-ks-soknad.disable-soknad',
}

export enum EFeatureToggle {
    // EKSEMPEL = 'EKSEMPEL',
    FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP = 'FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP',
    VIS_GUIDE_I_STEG = 'VIS_GUIDE_I_STEG',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    // [EFeatureToggle.EKSEMPEL]: 'familie-ks-soknad.eksempel',
    [EFeatureToggle.FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP]:
        'familie-ks-soknad.forklarende-tekster-over-legg-til-knapp',
    [EFeatureToggle.VIS_GUIDE_I_STEG]: 'familie-ks-soknad.vis-guide-i-steg',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
