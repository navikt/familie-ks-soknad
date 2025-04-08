export enum EToggle {
    KONTANTSTOTTE = 'familie-ks-soknad.disable-soknad',
}

export enum EFeatureToggle {
    // EKSEMPEL = 'EKSEMPEL',
    FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP = 'FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP',
    BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD = 'BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD',
    SPOR_OM_MANED_IKKE_DATO = 'SPOR_OM_MANED_IKKE_DATO',
    BRUK_NY_LAST_OPP_VEDLEGG_KOMPONENT = 'BRUK_NY_LAST_OPP_VEDLEGG_KOMPONENT',
    BRUK_OASIS = 'BRUK_OASIS_FOR_VEKSLING_TIL_OBO_TOKEN',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    // [EFeatureToggle.EKSEMPEL]: 'familie-ks-soknad.eksempel',
    [EFeatureToggle.FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP]:
        'familie-ks-soknad.forklarende-tekster-over-legg-til-knapp',
    [EFeatureToggle.BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD]:
        'familie-ks-soknad.bruk_nytt_endepunkt_for_innsending_av_soknad',
    [EFeatureToggle.SPOR_OM_MANED_IKKE_DATO]: 'familie-ks-soknad.spor-om-maned-ikke-dato',
    [EFeatureToggle.BRUK_NY_LAST_OPP_VEDLEGG_KOMPONENT]:
        'familie-ks-soknad.bruk-ny-last-opp-vedlegg-komponent',
    [EFeatureToggle.BRUK_OASIS]: 'familie-ks-soknad.bruk-oasis',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
