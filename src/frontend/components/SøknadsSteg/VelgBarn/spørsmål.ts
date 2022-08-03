export enum VelgBarnSpørsmålId {
    velgBarn = 'velg-barn',
    barnetsNavn = 'barnets-navn',
    leggTilBarnErFødt = 'legg-til-barn-er-født',
    leggTilBarnFornavn = 'legg-til-barn-fornavn',
    leggTilBarnEtternavn = 'legg-til-barn-etternavn',
    leggTilBarnNavnIkkeBestemt = 'legg-til-barn-ingen-navn',
    leggTilBarnFnr = 'legg-til-barn-fnr',
    leggTilBarnIkkeFåttFnr = 'legg-til-barn-ingen-fnr',
}

export const velgBarnSpørsmålSpråkId: Record<VelgBarnSpørsmålId, string> = {
    [VelgBarnSpørsmålId.velgBarn]: 'hvilkebarn.sidetittel',
    [VelgBarnSpørsmålId.barnetsNavn]: 'hvilkebarn.leggtilbarn.barnets-navn',
    [VelgBarnSpørsmålId.leggTilBarnFornavn]: 'hvilkebarn.leggtilbarn.fornavn.spm',
    [VelgBarnSpørsmålId.leggTilBarnEtternavn]: 'hvilkebarn.leggtilbarn.etternavn.spm',
    [VelgBarnSpørsmålId.leggTilBarnNavnIkkeBestemt]: 'hvilkebarn.leggtilbarn.navn-ikke-bestemt.spm',
    [VelgBarnSpørsmålId.leggTilBarnFnr]: 'felles.fødsels-eller-dnummer.label',
    [VelgBarnSpørsmålId.leggTilBarnIkkeFåttFnr]: 'hvilkebarn.leggtilbarn.ikke-fått-fnr.spm',
    [VelgBarnSpørsmålId.leggTilBarnErFødt]: 'hvilkebarn.leggtilbarn.barnfødt.spm',
};
