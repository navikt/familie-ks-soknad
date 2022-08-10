export enum DinLivssituasjonSpørsmålId {
    erAsylsøker = 'er-asylsøker',
    arbeidIUtlandet = 'arbeid-i-utlandet',
    mottarUtenlandspensjon = 'mottar-utenlandspensjon',
}

export const dinLivssituasjonSpørsmålSpråkId: Record<DinLivssituasjonSpørsmålId, string> = {
    [DinLivssituasjonSpørsmålId.erAsylsøker]: 'omdeg.asylsøker.spm',
    [DinLivssituasjonSpørsmålId.arbeidIUtlandet]: 'eøs.arbeid-utland.spm',
    [DinLivssituasjonSpørsmålId.mottarUtenlandspensjon]: 'omdeg.pensjonutland.spm',
};
