export enum EToggle {
    KONTANTSTOTTE = 'familie-ks-soknad.disable-soknad',
}

export enum EFeatureToggle {
    // EKSEMPEL = 'EKSEMPEL',
    FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP = 'FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP',
    VIS_GUIDE_I_STEG = 'VIS_GUIDE_I_STEG',
    BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD = 'BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    // [EFeatureToggle.EKSEMPEL]: 'familie-ks-soknad.eksempel',
    [EFeatureToggle.FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP]:
        'familie-ks-soknad.forklarende-tekster-over-legg-til-knapp',
    [EFeatureToggle.VIS_GUIDE_I_STEG]: 'familie-ks-soknad.vis-guide-i-steg',
    [EFeatureToggle.BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD]:
        'familie-ks-soknad.bruk_nytt_endepunkt_for_innsending_av_soknad',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
