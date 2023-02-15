export enum EToggle {
    KONTANTSTOTTE = 'familie-ks-soknad.disable-soknad',
}

// Legg til nye feature toggles her
export enum EFeatureToggle {
    EKSEMPEL_TOGGLE = 'EKSEMPEL_TOGGLE',
}

// Definer alle feature toggle keys her
export const ToggleKeys: Record<EFeatureToggle, string> = {
    EKSEMPEL_TOGGLE: 'familie-ks-soknad.eksempel_toggle', // Feature toggle enum navn -> feature toggle key navn i unleash
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

// Default verdier som brukes dersom man ikke finner feature toggle i unleash.
export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
    // Dersom noen toggler ikke skal være default false:
    ...{ [EFeatureToggle.EKSEMPEL_TOGGLE]: true },
};
