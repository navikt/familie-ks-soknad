export enum EToggle {
    KONTANTSTOTTE = 'familie-ks-soknad.disable-soknad',
}

export enum EFeatureToggle {}
/**
 * true -> fullt EØS skjema
 * false -> eøs dekkes ved opplasting av utfylt pdf
 */
//EXAMPLE = 'EXAMPLE',

export const ToggleKeys: Record<EFeatureToggle, string> = {
    // [EFeatureToggle.EXAMPLE]: 'familie-ks-soknad.example',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;
