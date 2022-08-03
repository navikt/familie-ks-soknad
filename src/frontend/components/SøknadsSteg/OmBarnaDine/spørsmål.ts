export enum OmBarnaDineSpørsmålId {
    erNoenAvBarnaFosterbarn = 'er-noen-av-barna-fosterbarn',
    hvemErFosterbarn = 'hvem-er-fosterbarn',
    oppholderBarnSegIInstitusjon = 'oppholder-barn-seg-i-institusjon',
    hvemOppholderSegIInstitusjon = 'hvem-oppholder-seg-i-institusjon',
    erBarnAdoptertFraUtland = 'er-barn-adoptert-fra-utland',
    hvemErAdoptertFraUtland = 'hvem-er-adoptert-fra-utland',
    søktAsylForBarn = 'søkt-asyl-for-barn',
    hvemErSøktAsylFor = 'hvem-er-søkt-asyl-for',
    barnOppholdtSegTolvMndSammenhengendeINorge = 'tolv-mnd-sammenhengende-i-norge',
    hvemTolvMndSammenhengendeINorge = 'hvem-tolv-mnd-sammenhengende-i-norge',
    mottarKontantstøtteForBarnFraAnnetEøsland = 'kontantstøtte-fra-annet-eøsland',
    hvemKontantstøtteFraAnnetEøsland = 'hvem-mottar-kontantstøtte-eøsland',
    erOppgittAvdødPartnerForelder = 'er-oppgitt-avdød-partner-forelder',
    erFolkeregAvdødEktefelleForelder = 'er-folkeregistrert-avdød-ektefelle-forelder',
    erFolkeregAvdødPartnerForelder = 'er-folkeregistrert-avdød-partner-forelder',
    hvemAvdødPartner = 'hvem-er-avdød-partner-forelder-til',
}

export const omBarnaDineSpørsmålSpråkId: Record<OmBarnaDineSpørsmålId, string> = {
    [OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn]: 'ombarna.fosterbarn.spm',
    [OmBarnaDineSpørsmålId.hvemErFosterbarn]: 'ombarna.fosterbarn.hvem.spm',
    [OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon]: 'ombarna.institusjon.spm',
    [OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon]: 'ombarna.institusjon.hvem.spm',
    [OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland]: 'ombarna.adoptert.spm',
    [OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland]: 'ombarna.adoptert.hvem.spm',
    [OmBarnaDineSpørsmålId.søktAsylForBarn]: 'ombarna.asyl.spm',
    [OmBarnaDineSpørsmålId.hvemErSøktAsylFor]: 'ombarna.asyl.hvem.spm',
    [OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge]:
        'ombarna.oppholdtsammenhengende.spm',
    [OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge]: 'ombarna.hvemavbarnaoppholdt.spm',
    [OmBarnaDineSpørsmålId.mottarKontantstøtteForBarnFraAnnetEøsland]:
        'ombarna.barnetrygd-eøs-fortid.spm',
    [OmBarnaDineSpørsmålId.hvemKontantstøtteFraAnnetEøsland]:
        'ombarna.barnetrygd-eøs-fortid.hvem.spm',
    [OmBarnaDineSpørsmålId.erOppgittAvdødPartnerForelder]: 'ombarna.enkeenkemann.oppgitt.spm',
    [OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder]:
        'ombarna.enkeenkemann.folkeregisteret-enke.spm',
    [OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder]:
        'ombarna.enkeenkemann.folkeregisteret-gjenlevende.spm',
    [OmBarnaDineSpørsmålId.hvemAvdødPartner]: 'ombarna.enkeenkemann.hvem.spm',
};
