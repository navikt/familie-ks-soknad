export enum EToggle {
    KONTANTSTOTTE = 'familie-ks-soknad.disable-soknad',
}

export enum EFeatureToggle {
    DISABLE_SEND_INN_KNAPP = 'DISABLE_SEND_INN_KNAPP',
}
/**
 * true -> fullt EØS skjema
 * false -> eøs dekkes ved opplasting av utfylt pdf
 */
//EXAMPLE = 'EXAMPLE',

export const ToggleKeys: Record<EFeatureToggle, string> = {
    [EFeatureToggle.DISABLE_SEND_INN_KNAPP]: 'familie-ks-soknad.disable-send-inn-knapp',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;
