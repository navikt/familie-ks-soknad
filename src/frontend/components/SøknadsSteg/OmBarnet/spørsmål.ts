export enum OmBarnetSpørsmålsId {
    utbetaltForeldrepengerEllerEngangsstønad = 'utbetalt-foreldrepenger-eller-engangsstønad',
    planleggerÅBoINorge12Mnd = 'barn-planlegger-å-bo-sammenhengende-i-norge-12mnd',
    pågåendeSøknadFraAnnetEøsLand = 'pågående-søknad-fra-annet-eøsland',
    pågåendeSøknadHvilketLand = 'pågående-søknad-hvilket-land',
    mottarEllerMottokEøsKontantstøtte = 'mottar-eller-mottok-eøs-kontantstøtte',
    andreForelderNavn = 'andre-forelder-navn',
    andreForelderKanIkkeGiOpplysninger = 'andre-forelder-kan-ikke-gi-opplysninger',
    andreForelderFnr = 'andre-forelder-fødsels-/dnummer',
    andreForelderFnrUkjent = 'andre-forelder-fødsels-/dnummer-ukjent',
    andreForelderFødselsdato = 'andre-forelder-fødselsdato',
    andreForelderFødselsdatoUkjent = 'andre-forelder-fødselsdato-ukjent',
    andreForelderVærtINorgeSisteTolvMåneder = 'andre-forelder-vært-i-norge-siste-tolv-måneder',
    andreForelderPlanleggerÅBoINorgeTolvMnd = 'andre-forelder-planlegger-å-bo-i-norge-tolv-mnd',
    andreForelderYrkesaktivFemÅr = 'andre-forelder-yrkesaktiv-fem-år',
    andreForelderArbeidUtlandet = 'andre-forelder-arbeid',
    andreForelderArbeidUtlandetEnke = 'andre-forelder-arbeid-enke',
    andreForelderPensjonUtland = 'andre-forelder-pensjon-utland',
    andreForelderPensjonUtlandEnke = 'andre-forelder-pensjon-utland-enke',
    borFastMedSøker = 'bor-barnet-fast-med-deg',
    skriftligAvtaleOmDeltBosted = 'skriftlig-avtale-om-delt-bosted',
    sammeForelderSomAnnetBarn = 'samme-forelder-som-annet-barn',
}

export const omBarnetSpørsmålSpråkId: Record<OmBarnetSpørsmålsId, string> = {
    [OmBarnetSpørsmålsId.utbetaltForeldrepengerEllerEngangsstønad]:
        'todo.ombarnet.utbetalt.foreldrepenger.engangsstønad',
    [OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd]: 'ombarnet.oppholdtsammenhengende.spm',
    [OmBarnetSpørsmålsId.pågåendeSøknadFraAnnetEøsLand]: 'ombarnet.pågåendesøknad.spm',
    [OmBarnetSpørsmålsId.pågåendeSøknadHvilketLand]: 'ombarnet.hvilketlandsøkt.spm',
    [OmBarnetSpørsmålsId.mottarEllerMottokEøsKontantstøtte]:
        'ombarnet.fårellerharsøktbarnetrygdeøs.spm',
    [OmBarnetSpørsmålsId.andreForelderNavn]: 'ombarnet.andre-forelder.navn.spm',
    [OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger]:
        'ombarnet.andre-forelder.navn-ukjent.spm',
    [OmBarnetSpørsmålsId.andreForelderFnr]: 'felles.fødsels-eller-dnummer.label',
    [OmBarnetSpørsmålsId.andreForelderFnrUkjent]: 'ombarnet.andre-forelder.fnr-ukjent.spm',
    [OmBarnetSpørsmålsId.andreForelderFødselsdato]: 'felles.fødselsdato.label',
    [OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent]: 'felles.fødselsdato-ukjent',
    [OmBarnetSpørsmålsId.andreForelderVærtINorgeSisteTolvMåneder]:
        'todo.andreforelder.utenlandsopphold',
    [OmBarnetSpørsmålsId.andreForelderPlanleggerÅBoINorgeTolvMnd]:
        'todo.andreforelder.utenlandsopphold',
    [OmBarnetSpørsmålsId.andreForelderYrkesaktivFemÅr]: 'todo.andreforelder.yrkesaktiv',
    [OmBarnetSpørsmålsId.andreForelderArbeidUtlandet]: 'eøs.andre-forelder.arbeid-utland.spm',
    [OmBarnetSpørsmålsId.andreForelderArbeidUtlandetEnke]:
        'enkeenkemann.andreforelder-arbeidutland.spm',
    [OmBarnetSpørsmålsId.andreForelderPensjonUtland]: 'ombarnet.andreforelderpensjonutland.spm',
    [OmBarnetSpørsmålsId.andreForelderPensjonUtlandEnke]:
        'enkeenkemann.andre-forelder.utenlandspensjon.spm',
    [OmBarnetSpørsmålsId.borFastMedSøker]: 'ombarnet.bor-fast.spm',
    [OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted]: 'ombarnet.delt-bosted.spm',
    [OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn]: 'ombarnet.hvemerandreforelder.spm',
};
