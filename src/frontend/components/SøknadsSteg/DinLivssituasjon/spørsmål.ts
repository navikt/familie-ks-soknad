export enum DinLivssituasjonSpørsmålId {
    erAsylsøker = 'er-asylsøker',
    jobberPåBåt = 'jobber-på-båt',
    mottarUtenlandspensjon = 'mottar-utenlandspensjon',
}

export const dinLivssituasjonSpørsmålSpråkId: Record<DinLivssituasjonSpørsmålId, string> = {
    [DinLivssituasjonSpørsmålId.erAsylsøker]: 'omdeg.asylsøker.spm',
    [DinLivssituasjonSpørsmålId.jobberPåBåt]: 'eøs.arbeid-utland.spm',
    [DinLivssituasjonSpørsmålId.mottarUtenlandspensjon]: 'omdeg.pensjonutland.spm',
};
