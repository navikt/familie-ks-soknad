import { TilKontraktTestData } from './typer';
import { ISøknad } from '../../../typer/søknad';

export const testdata5: TilKontraktTestData = {
    input: {
        erEøs: true,
        kontraktVersjon: '1',
        antallEøsSteg: 2,
        barnInkludertISøknaden: [
            {
                id: '786fb149-2331-4dc2-9b0e-b5f4768952d5',
                navn: 'Barn 234567 89876',
                ident: '23456789876',
                alder: '13',
                borMedSøker: false,
                adressebeskyttelse: true,
                adresse: {
                    svar: 'Vei 12',
                    id: 'barnets-adresse',
                },
                harEøsSteg: false,
                barnErFyltUt: true,
                utenlandsperioder: [],
                eøsKontantstøttePerioder: [],
                barnehageplassPerioder: [],
                idNummer: [],
                andreForelder: {
                    kanIkkeGiOpplysninger: {
                        id: 'andre-forelder-kan-ikke-gi-opplysninger',
                        svar: 'NEI',
                    },
                    navn: {
                        id: 'andre-forelder-navn',
                        svar: 'aehjsrtjsrtjhfshfbfgb',
                    },
                    fnr: {
                        id: 'andre-forelder-fødsels-/dnummer',
                        svar: 'UKJENT',
                    },
                    fødselsdato: {
                        id: 'andre-forelder-fødselsdato',
                        svar: 'UKJENT',
                    },
                    værtINorgeITolvMåneder: {
                        id: 'andre-forelder-vært-i-norge-siste-tolv-måneder',
                        svar: 'NEI',
                    },
                    planleggerÅBoINorgeTolvMnd: {
                        id: 'andre-forelder-planlegger-å-bo-i-norge-tolv-mnd',
                        svar: 'JA',
                    },
                    yrkesaktivFemÅr: {
                        id: 'andre-forelder-yrkesaktiv-fem-år',
                        svar: 'JA',
                    },
                    arbeidUtlandet: {
                        svar: 'VET_IKKE',
                        id: 'andre-forelder-arbeid',
                    },
                    pensjonUtland: {
                        svar: 'VET_IKKE',
                        id: 'andre-forelder-pensjon-utland',
                    },
                    adresse: {
                        svar: 'Heisannveien 14',
                        id: 'andre-forelder-adresse',
                    },
                    pensjonNorge: {
                        svar: 'NEI',
                        id: 'andre-forelder-pensjon-norge',
                    },
                    arbeidNorge: {
                        svar: 'NEI',
                        id: 'andre-forelder-arbeid-norge',
                    },
                    andreUtbetalinger: {
                        svar: 'NEI',
                        id: 'andre-forelder-andre-utbetalinger',
                    },
                    pågåendeSøknadFraAnnetEøsLand: {
                        id: 'andre-forelder-pågående-søknad',
                        svar: 'JA',
                    },
                    pågåendeSøknadHvilketLand: {
                        id: 'andre-forelder-pågående-søknad-land',
                        svar: 'BEL',
                    },
                    kontantstøtteFraEøs: {
                        id: 'andre-forelder-kontantstøtte',
                        svar: 'NEI',
                    },
                    eøsKontantstøttePerioder: [],
                    arbeidsperioderUtland: [],
                    pensjonsperioderUtland: [],
                    arbeidsperioderNorge: [],
                    pensjonsperioderNorge: [],
                    andreUtbetalingsperioder: [],
                    utenlandsperioder: [],
                    idNummer: [],
                },
                triggetEøs: false,
                sammeForelderSomAnnetBarnMedId: {
                    id: 'samme-forelder-som-annet-barn',
                    svar: null,
                },
                erFosterbarn: {
                    id: 'hvem-er-fosterbarn',
                    svar: 'NEI',
                },
                erAdoptert: {
                    id: 'hvem-er-adoptert',
                    svar: 'NEI',
                },
                erAsylsøker: {
                    id: 'hvem-er-søkt-asyl-for',
                    svar: 'NEI',
                },
                kontantstøtteFraAnnetEøsland: {
                    id: 'hvem-mottar-kontantstøtte-eøsland',
                    svar: 'NEI',
                },
                andreForelderErDød: {
                    id: 'hvem-er-avdød-partner-forelder-til',
                    svar: 'NEI',
                },
                oppholderSegIInstitusjon: {
                    id: 'hvem-oppholder-seg-i-institusjon',
                    svar: 'NEI',
                },
                institusjonIUtland: {
                    id: 'institusjonIUtland',
                    svar: 'NEI',
                },
                institusjonsnavn: {
                    id: 'institusjonsnavn',
                    svar: '',
                },
                institusjonsadresse: {
                    id: 'institusjonsadresse',
                    svar: '',
                },
                institusjonspostnummer: {
                    id: 'institusjonspostnummer',
                    svar: '',
                },
                institusjonOppholdStartdato: {
                    id: 'institusjon-opphold-startdato',
                    svar: '',
                },
                institusjonOppholdSluttdato: {
                    id: 'institusjon-opphold-sluttdato',
                    svar: '',
                },
                boddMindreEnn12MndINorge: {
                    id: 'hvem-tolv-mnd-sammenhengende-i-norge',
                    svar: 'NEI',
                },
                planleggerÅBoINorge12Mnd: {
                    id: 'barn-planlegger-å-bo-sammenhengende-i-norge-12mnd',
                    svar: null,
                },
                borFastMedSøker: {
                    id: 'bor-barnet-fast-med-deg',
                    svar: 'JA',
                },
            },
            {
                id: 'c766c4f4-f319-482b-aba3-7e732d518a39',
                navn: 'Barn Barnessen III',
                ident: '12345678987',
                alder: '12',
                adresse: {
                    svar: 'Vei 12',
                    id: 'barnets-adresse',
                },
                borMedSøker: true,
                adressebeskyttelse: false,
                barnErFyltUt: true,
                harEøsSteg: false,
                utenlandsperioder: [
                    {
                        utenlandsoppholdÅrsak: {
                            id: 'årsak-utenlandsopphold',
                            svar: 'HAR_OPPHOLDT_SEG_UTENFOR_NORGE',
                        },
                        oppholdsland: {
                            id: 'land-utenlandsopphold',
                            svar: 'BEL',
                        },
                        oppholdslandFraDato: {
                            id: 'fra-dato-utenlandsopphold',
                            svar: '2022-01-11',
                        },
                        oppholdslandTilDato: {
                            id: 'til-dato-utenlandsopphold',
                            svar: '2022-01-19',
                        },
                    },
                ],
                eøsKontantstøttePerioder: [],
                barnehageplassPerioder: [],
                idNummer: [],
                andreForelder: {
                    kanIkkeGiOpplysninger: {
                        id: 'andre-forelder-kan-ikke-gi-opplysninger',
                        svar: 'NEI',
                    },
                    navn: {
                        id: 'andre-forelder-navn',
                        svar: 'gdjhrstjsrthrfgfdgfdgdf',
                    },
                    fnr: {
                        id: 'andre-forelder-fødsels-/dnummer',
                        svar: 'UKJENT',
                    },
                    fødselsdato: {
                        id: 'andre-forelder-fødselsdato',
                        svar: '1992-01-09',
                    },
                    værtINorgeITolvMåneder: {
                        id: 'andre-forelder-vært-i-norge-siste-tolv-måneder',
                        svar: 'JA',
                    },
                    planleggerÅBoINorgeTolvMnd: {
                        id: 'andre-forelder-planlegger-å-bo-i-norge-tolv-mnd',
                        svar: 'JA',
                    },
                    yrkesaktivFemÅr: {
                        id: 'andre-forelder-yrkesaktiv-fem-år',
                        svar: 'JA',
                    },
                    arbeidUtlandet: {
                        svar: 'VET_IKKE',
                        id: 'andre-forelder-arbeid',
                    },
                    pensjonUtland: {
                        svar: 'VET_IKKE',
                        id: 'andre-forelder-pensjon-utland',
                    },
                    adresse: {
                        svar: 'Heisannveien 14',
                        id: 'andre-forelder-adresse',
                    },
                    pensjonNorge: {
                        svar: 'NEI',
                        id: 'andre-forelder-pensjon-norge',
                    },
                    arbeidNorge: {
                        svar: 'NEI',
                        id: 'andre-forelder-arbeid-norge',
                    },
                    andreUtbetalinger: {
                        svar: 'NEI',
                        id: 'andre-forelder-andre-utbetalinger',
                    },
                    utvidet: {
                        søkerHarBoddMedAndreForelder: {
                            id: 'søker-har-bodd-med-andre-forelder',
                            svar: 'JA',
                        },
                        søkerFlyttetFraAndreForelderDato: {
                            id: 'søker-flyttet-fra-andre-forelder-dato',
                            svar: '2022-01-11',
                        },
                    },
                    pågåendeSøknadFraAnnetEøsLand: {
                        id: 'andre-forelder-pågående-søknad',
                        svar: 'JA',
                    },
                    pågåendeSøknadHvilketLand: {
                        id: 'andre-forelder-pågående-søknad-land',
                        svar: 'BEL',
                    },
                    kontantstøtteFraEøs: {
                        id: 'andre-forelder-kontantstøtte',
                        svar: 'NEI',
                    },
                    eøsKontantstøttePerioder: [],
                    arbeidsperioderUtland: [],
                    pensjonsperioderUtland: [],
                    arbeidsperioderNorge: [],
                    utenlandsperioder: [],
                    pensjonsperioderNorge: [],
                    andreUtbetalingsperioder: [],
                    idNummer: [],
                },
                triggetEøs: true,
                sammeForelderSomAnnetBarnMedId: {
                    id: 'samme-forelder-som-annet-barn',
                    svar: 'ANNEN_FORELDER',
                },
                erFosterbarn: {
                    id: 'hvem-er-fosterbarn',
                    svar: 'NEI',
                },
                erAdoptert: {
                    id: 'hvem-er-adoptert',
                    svar: 'NEI',
                },
                erAsylsøker: {
                    id: 'hvem-er-søkt-asyl-for',
                    svar: 'NEI',
                },
                kontantstøtteFraAnnetEøsland: {
                    id: 'hvem-mottar-kontantstøtte-eøsland',
                    svar: 'NEI',
                },
                andreForelderErDød: {
                    id: 'hvem-er-avdød-partner-forelder-til',
                    svar: 'NEI',
                },
                oppholderSegIInstitusjon: {
                    id: 'hvem-oppholder-seg-i-institusjon',
                    svar: 'NEI',
                },
                institusjonIUtland: {
                    id: 'institusjonIUtland',
                    svar: 'NEI',
                },
                institusjonsnavn: {
                    id: 'institusjonsnavn',
                    svar: '',
                },
                institusjonsadresse: {
                    id: 'institusjonsadresse',
                    svar: '',
                },
                institusjonspostnummer: {
                    id: 'institusjonspostnummer',
                    svar: '',
                },
                institusjonOppholdStartdato: {
                    id: 'institusjon-opphold-startdato',
                    svar: '',
                },
                institusjonOppholdSluttdato: {
                    id: 'institusjon-opphold-sluttdato',
                    svar: '',
                },
                boddMindreEnn12MndINorge: {
                    id: 'hvem-tolv-mnd-sammenhengende-i-norge',
                    svar: 'JA',
                },
                planleggerÅBoINorge12Mnd: {
                    id: 'barn-planlegger-å-bo-sammenhengende-i-norge-12mnd',
                    svar: 'NEI',
                },
                borFastMedSøker: {
                    id: 'bor-barnet-fast-med-deg',
                    svar: 'JA',
                },
            },
        ],
        lestOgForståttBekreftelse: true,
        barnRegistrertManuelt: [],
        dokumentasjon: [
            {
                dokumentasjonsbehov: 'AVTALE_DELT_BOSTED',
                tittelSpråkId: 'dokumentasjon.deltbosted.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.deltbosted.informasjon',
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: true,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'VEDTAK_OPPHOLDSTILLATELSE',
                tittelSpråkId: 'dokumentasjon.oppholdstillatelse.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.oppholdstillatelse.informasjon',
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        dokumentId: 'b551d480-63e2-4dcf-8872-a545ffddb625',
                        navn: 'sc1.jpeg',
                        størrelse: 481593,
                        tidspunkt: '2022-01-27T06:37:03.457Z',
                    },
                ],
            },
            {
                dokumentasjonsbehov: 'ADOPSJON_DATO',
                tittelSpråkId: 'dokumentasjon.adopsjon.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.adopsjon.informasjon',
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'BEKREFTELSE_FRA_BARNEVERN',
                tittelSpråkId: 'dokumentasjon.bekreftelsebarnevernet.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.bekreftelsebarnevernet.informasjon',
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: true,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'BOR_FAST_MED_SØKER',
                tittelSpråkId: 'dokumentasjon.bekreftelseborsammen.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.bekreftelseborsammen.informasjon',
                gjelderForBarnId: ['786fb149-2331-4dc2-9b0e-b5f4768952d5'],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        dokumentId: '68e9f01c-6729-459e-8bab-0bf937d3597b',
                        navn: 'sc1.jpeg',
                        størrelse: 481593,
                        tidspunkt: '2022-01-27T06:40:58.475Z',
                    },
                ],
            },
            {
                dokumentasjonsbehov: 'ANNEN_DOKUMENTASJON',
                tittelSpråkId: 'dokumentasjon.annendokumentasjon.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.annendokumentasjon.utvidet.informasjon',
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [],
            },
        ],
        søker: {
            navn: 'Voksen Voksnessen',
            barn: [
                {
                    id: '786fb149-2331-4dc2-9b0e-b5f4768952d5',
                    navn: 'Barn 234567 89876',
                    ident: '23456789876',
                    alder: '13',
                    borMedSøker: false,
                    adressebeskyttelse: true,
                },
                {
                    id: 'c766c4f4-f319-482b-aba3-7e732d518a39',
                    navn: 'Barn Barnessen III',
                    ident: '12345678987',
                    alder: '12',
                    borMedSøker: true,
                    adressebeskyttelse: false,
                },
            ],
            triggetEøs: false,
            idNummer: [],
            adresseISøkeperiode: { id: 'eøs-om-deg.dittoppholdssted.spm', svar: '' },
            statsborgerskap: [
                {
                    landkode: 'NOR',
                },
                {
                    landkode: 'AFG',
                },
            ],
            ident: '23058518298',
            sivilstand: {
                type: 'GIFT',
            },
            adressebeskyttelse: false,
            adresse: {
                adressenavn: 'Solveien',
                postnummer: '2304',
                husnummer: '2',
                husbokstav: 'A',
                bruksenhetnummer: 'H0101',
                bostedskommune: null,
                poststed: 'HAMAR',
            },
            utenlandsperioder: [],
            borPåRegistrertAdresse: {
                id: 'bor-på-registrert-adresse',
                svar: 'JA',
            },
            værtINorgeITolvMåneder: {
                id: 'søker-vært-i-norge-sammenhengende-tolv-måneder',
                svar: 'JA',
            },
            planleggerÅBoINorgeTolvMnd: {
                id: 'søker-planlegger-å-bo-i-norge-sammenhengende-tolv-måneder',
                svar: null,
            },
            erAsylsøker: {
                id: 'er-asylsøker',
                svar: 'NEI',
            },
            arbeidIUtlandet: {
                id: 'arbeid-i-utlandet',
                svar: 'NEI',
            },
            arbeidsland: {
                id: 'arbeidsland',
                svar: '',
            },
            mottarUtenlandspensjon: {
                id: 'mottar-utenlandspensjon',
                svar: 'JA',
            },
            pensjonsland: {
                id: 'pensjonsland',
                svar: 'BEN',
            },
            arbeidsperioderUtland: [],
            arbeidsperioderNorge: [],
            pensjonsperioderNorge: [],
            pensjonsperioderUtland: [],
            andreUtbetalingsperioder: [],
            harSamboerNå: {
                id: 'har-samboer-nå-og-gift',
                svar: 'NEI',
            },
            utvidet: {
                spørsmål: {
                    årsak: {
                        id: 'årsak',
                        svar: 'FORVARING',
                    },
                    separertEnkeSkilt: {
                        id: 'separert-enke-skilt',
                        svar: 'NEI',
                    },
                    separertEnkeSkiltUtland: {
                        id: 'separert-enke-skilt-utland',
                        svar: null,
                    },
                    separertEnkeSkiltDato: {
                        id: 'separert-enke-skilt-dato',
                        svar: '',
                    },
                },
            },
        },
        erNoenAvBarnaFosterbarn: {
            id: 'er-noen-av-barna-fosterbarn',
            svar: 'NEI',
        },
        oppholderBarnSegIInstitusjon: {
            id: 'oppholder-barn-seg-i-institusjon',
            svar: 'NEI',
        },
        erBarnAdoptert: {
            id: 'er-barn-adoptert',
            svar: 'NEI',
        },
        søktAsylForBarn: {
            id: 'søkt-asyl-for-barn',
            svar: 'NEI',
        },
        barnOppholdtSegTolvMndSammenhengendeINorge: {
            id: 'tolv-mnd-sammenhengende-i-norge',
            svar: 'NEI',
        },
        mottarKontantstøtteForBarnFraAnnetEøsland: {
            id: 'kontantstøtte-fra-annet-eøsland',
            svar: 'NEI',
        },
        harEllerTildeltBarnehageplass: {
            id: 'har-eller-tildelt-barnehageplass',
            svar: 'JA',
        },
        erAvdødPartnerForelder: {
            id: 'er-folkeregistrert-avdød-ektefelle-forelder',
            svar: null,
        },
    } as unknown as ISøknad,
    output: {
        kontraktVersjon: 1,
        antallEøsSteg: 2,
        søker: {
            harEøsSteg: true,
            navn: {
                label: { en: 'Name', nb: 'Navn', nn: 'Namn' },
                verdi: {
                    nb: 'Voksen Voksnessen',
                    nn: 'Voksen Voksnessen',
                    en: 'Voksen Voksnessen',
                },
            },
            ident: {
                label: { en: 'Ident', nb: 'Ident', nn: 'Ident' },
                verdi: { nb: '23058518298', nn: '23058518298', en: '23058518298' },
            },
            sivilstand: {
                label: { en: 'Marital status', nb: 'Sivilstatus', nn: 'Sivilstatus' },
                verdi: { nb: 'GIFT', nn: 'GIFT', en: 'GIFT' },
            },
            statsborgerskap: {
                label: { en: 'Citizenship', nb: 'Statsborgerskap', nn: 'Statsborgarskap' },
                verdi: {
                    nb: ['Norge', 'Afghanistan'],
                    nn: ['Noreg', 'Afghanistan'],
                    en: ['Norway', 'Afghanistan'],
                },
            },
            adresse: {
                label: { en: 'Address', nb: 'Adresse', nn: 'Adresse' },
                verdi: {
                    nb: {
                        adressenavn: 'Solveien',
                        postnummer: '2304',
                        husnummer: '2',
                        husbokstav: 'A',
                        bruksenhetnummer: 'H0101',
                        bostedskommune: null,
                        poststed: 'HAMAR',
                    },
                    nn: {
                        adressenavn: 'Solveien',
                        postnummer: '2304',
                        husnummer: '2',
                        husbokstav: 'A',
                        bruksenhetnummer: 'H0101',
                        bostedskommune: null,
                        poststed: 'HAMAR',
                    },
                    en: {
                        adressenavn: 'Solveien',
                        postnummer: '2304',
                        husnummer: '2',
                        husbokstav: 'A',
                        bruksenhetnummer: 'H0101',
                        bostedskommune: null,
                        poststed: 'HAMAR',
                    },
                },
            },
            adressebeskyttelse: false,
            utenlandsperioder: [],
            idNummer: [],
            spørsmål: {
                borPåRegistrertAdresse: {
                    label: {
                        en: 'Do you live at this address?',
                        nb: 'Bor du på denne adressen?',
                        nn: 'Bur du på denne adressa?',
                    },
                    verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                },
                værtINorgeITolvMåneder: {
                    label: {
                        en: 'Have you stayed continuously in Norway for the last twelve months?',
                        nb: 'Har du oppholdt deg sammenhengende i Norge de siste tolv månedene?',
                        nn: 'Har du opphalde deg samanhengande i Noreg dei siste tolv månadene?',
                    },
                    verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                },
                yrkesaktivFemÅr: {
                    label: {
                        en: 'TODO søker yrkesaktiv',
                        nb: 'TODO søker yrkesaktiv',
                        nn: 'TODO søker yrkesaktiv',
                    },
                    verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                },
                erAsylsøker: {
                    label: {
                        en: 'Are you an asylum seeker?',
                        nb: 'Er du asylsøker?',
                        nn: 'Er du asylsøkar?',
                    },
                    verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                },
                arbeidIUtlandet: {
                    label: {
                        en: "Do you or have you worked outside of Norway, on a foreign ship or on another country's continental shelf?",
                        nb: 'Arbeider eller har du arbeidet utenfor Norge, på utenlandsk skip eller på utenlandsk kontinentalsokkel?',
                        nn: 'Arbeider eller har du arbeidt utanfor Noreg, på utanlandsk skip eller på utanlandsk kontinentalsokkel?',
                    },
                    verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                },
                mottarUtenlandspensjon: {
                    label: {
                        en: 'Do you or have you received a pension from abroad?',
                        nb: 'Får eller har du fått pensjon fra utlandet?',
                        nn: 'Får eller har du fått pensjon frå utlandet?',
                    },
                    verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                },
                pensjonsland: {
                    label: { en: 'ukjent-spørsmål', nb: 'ukjent-spørsmål', nn: 'ukjent-spørsmål' },
                    verdi: { nb: 'Benin', nn: 'Benin', en: 'Benin' },
                },
                harSamboerNå: {
                    label: { en: 'ukjent-spørsmål', nb: 'ukjent-spørsmål', nn: 'ukjent-spørsmål' },
                    verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                },
            },
            arbeidsperioderUtland: [],
            arbeidsperioderNorge: [],
            pensjonsperioderUtland: [],
            pensjonsperioderNorge: [],
            andreUtbetalingsperioder: [],
        },
        barn: [
            {
                harEøsSteg: false,
                navn: {
                    label: { en: 'Name', nb: 'Navn', nn: 'Namn' },
                    verdi: {
                        nb: 'Barn 234567 89876',
                        nn: 'Barn 234567 89876',
                        en: 'Barn 234567 89876',
                    },
                },
                ident: {
                    label: { en: 'Ident', nb: 'Ident', nn: 'Ident' },
                    verdi: { nb: '23456789876', nn: '23456789876', en: '23456789876' },
                },
                registrertBostedType: {
                    label: {
                        en: 'Registered place of residence',
                        nb: 'Registrert bosted',
                        nn: 'Registrert bustad',
                    },
                    verdi: { nb: 'ADRESSESPERRE', nn: 'ADRESSESPERRE', en: 'ADRESSESPERRE' },
                },
                alder: {
                    label: { en: 'Age', nb: 'Alder', nn: 'Alder' },
                    verdi: { en: '13 years', nb: '13 år', nn: '13 år' },
                },
                utenlandsperioder: [],
                eøsKontantstøttePerioder: [],
                barnehageplassPerioder: [],
                idNummer: [],
                andreForelder: {
                    kanIkkeGiOpplysninger: {
                        label: {
                            en: 'I am unable to provide information about the other parent',
                            nb: 'Jeg kan ikke gi opplysninger om den andre forelderen',
                            nn: 'Eg kan ikkje gje opplysningar om den andre forelderen',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    navn: {
                        label: { en: 'Name', nb: 'Navn', nn: 'Namn' },
                        verdi: {
                            nb: 'aehjsrtjsrtjhfshfbfgb',
                            nn: 'aehjsrtjsrtjhfshfbfgb',
                            en: 'aehjsrtjsrtjhfshfbfgb',
                        },
                    },
                    fnr: {
                        label: {
                            en: 'Norwegian National identity number or D number',
                            nb: 'Fødselsnummer eller d-nummer',
                            nn: 'Fødselsnummer eller d-nummer',
                        },
                        verdi: {
                            en: "I don't know their National identity number or-D number",
                            nb: 'Jeg kjenner ikke fødselsnummer eller d-nummer',
                            nn: 'Eg kjenner ikkje fødselsnummer eller d-nummer',
                        },
                    },
                    fødselsdato: {
                        label: { en: 'Date of birth', nb: 'Fødselsdato', nn: 'Fødselsdato' },
                        verdi: {
                            en: "I don't know the date of birth",
                            nb: 'Jeg kjenner ikke fødselsdato',
                            nn: 'Eg kjenner ikkje fødselsdato',
                        },
                    },
                    værtINorgeSisteTolvMåneder: {
                        label: {
                            en: 'todo.andreforelder.utenlandsopphold',
                            nb: 'TODO andre forelder utenlandsopphold',
                            nn: 'todo.andreforelder.utenlandsopphold',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    utenlandsperioder: [],
                    planleggerÅBoINorgeTolvMnd: {
                        label: {
                            en: 'todo.andreforelder.utenlandsopphold',
                            nb: 'TODO andre forelder utenlandsopphold',
                            nn: 'todo.andreforelder.utenlandsopphold',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    yrkesaktivFemÅr: {
                        label: {
                            en: 'TODO andre forelder yrkesaktiv',
                            nb: 'TODO andre forelder yrkesaktiv',
                            nn: 'TODO andre forelder yrkesaktiv',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    pensjonUtland: {
                        label: {
                            en: "Does Barn 234567 89876's other parent receive, or have they received a pension from abroad?",
                            nb: 'Får eller har den andre forelderen til Barn 234567 89876 fått pensjon fra utlandet?',
                            nn: 'Får eller har den andre forelderen til Barn 234567 89876 fått pensjon frå utlandet?',
                        },
                        verdi: { nb: 'VET_IKKE', nn: 'VET_IKKE', en: 'VET_IKKE' },
                    },
                    arbeidUtlandet: {
                        label: {
                            en: "Does Barn 234567 89876's other parent work, or have they worked outside of Norway, on a foreign ship or on a foreign continental shelf?",
                            nb: 'Arbeider eller har den andre forelderen til Barn 234567 89876 arbeidet utenfor Norge, på utenlandsk skip eller på utenlandsk kontinentalsokkel?',
                            nn: 'Arbeider eller har den andre forelderen til Barn 234567 89876 arbeidt utanfor Noreg, på utanlandsk skip eller på utanlandsk kontinentalsokkel?',
                        },
                        verdi: { nb: 'VET_IKKE', nn: 'VET_IKKE', en: 'VET_IKKE' },
                    },
                    pensjonNorge: {
                        label: {
                            en: "Does Barn 234567 89876's other parent receive, or have they received a pension from Norway?",
                            nb: 'Får eller har Barn 234567 89876 sin andre forelder fått pensjon fra Norge?',
                            nn: 'Får eller har Barn 234567 89876 sin andre forelder fått pensjon frå Noreg?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    arbeidNorge: {
                        label: {
                            en: "Does Barn 234567 89876's other parent work, or have they worked in Norway, on the Norwegian continental shelf or on a ship flying the Norwegian flag?",
                            nb: 'Arbeider eller har den andre forelderen til Barn 234567 89876 arbeidet i Norge, på norsk kontinentalsokkel eller på skip som fører norsk flagg?',
                            nn: 'Arbeider eller har den andre forelderen til Barn 234567 89876 arbeidt i Noreg, på norsk kontinentalsokkel eller på skip som fører norsk flagg?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    andreUtbetalinger: {
                        label: {
                            en: "Does Barn 234567 89876's other parent receive, or have they received benefits that replace income from Norway and/or another EEA member state?",
                            nb: 'Får eller har Barn 234567 89876 sin andre forelder fått utbetalinger som erstatter arbeidsinntekt fra Norge og/eller andre EØS-land?',
                            nn: 'Får eller har Barn 234567 89876 sin andre forelder fått utbetalingar som erstattar arbeidsinntekt frå Noreg og/eller andre EØS-land?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    pågåendeSøknadFraAnnetEøsLand: {
                        label: {
                            en: "Does Barn 234567 89876's other parent have an active application for child benefit from another EEA country?",
                            nb: 'Har Barn 234567 89876 sin andre forelder en pågående søknad om barnetrygd fra et annet EU/EØS land?',
                            nn: 'Har Barn 234567 89876 sin andre forelder ein pågåande søknad om barnetrygd frå eit anna EU/EØS-land?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    pågåendeSøknadHvilketLand: {
                        label: {
                            en: "What country has Barn 234567 89876's other parent applied for child benefit from?",
                            nb: 'Hvilket land har Barn 234567 89876 sin andre forelder søkt om barnetrygd fra?',
                            nn: 'Kva land har Barn 234567 89876 sin andre forelder søkt om barnetrygd frå?',
                        },
                        verdi: { nb: 'Belgia', nn: 'Belgia', en: 'Belgium' },
                    },
                    kontantstøtteFraEøs: {
                        label: {
                            en: "Is Barn 234567 89876's other parent receiving or have they received child benefit from another EEA country?",
                            nb: 'Får eller har Barn 234567 89876 sin andre forelder fått barnetrygd fra et annet EU/EØS land?',
                            nn: 'Får eller har Barn 234567 89876 sin andre forelder fått barnetrygd frå eit anna EU/EØS-land?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    adresse: {
                        label: {
                            en: "Where is Barn 234567 89876's other parent living during the period for which you are applying for child benefit?",
                            nb: 'Hvor bor Barn 234567 89876 sin andre forelder i perioden det søkes om barnetrygd?',
                            nn: 'Kor bur Barn 234567 89876 sin andre forelder i perioden det vert søkt om barnetrygd?',
                        },
                        verdi: {
                            nb: 'Heisannveien 14',
                            nn: 'Heisannveien 14',
                            en: 'Heisannveien 14',
                        },
                    },
                    arbeidsperioderUtland: [],
                    pensjonsperioderUtland: [],
                    arbeidsperioderNorge: [],
                    pensjonsperioderNorge: [],
                    andreUtbetalingsperioder: [],
                    eøsKontantstøttePerioder: [],
                    idNummer: [],
                },
                omsorgsperson: null,
                spørsmål: {
                    erFosterbarn: {
                        label: {
                            en: 'Which of the children are foster children?',
                            nb: 'Hvem av barna er fosterbarn?',
                            nn: 'Kven av barna er fosterbarn?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    erAdoptert: {
                        label: {
                            en: 'Which of the children are adopted from abroad?',
                            nb: 'Hvem av barna er adoptert fra utlandet?',
                            nn: 'Kven av barna er adoptert frå utlandet?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    erAsylsøker: {
                        label: {
                            en: 'For which of the children has an application for asylum been submitted?',
                            nb: 'Hvem av barna er det søkt om asyl for?',
                            nn: 'Kven av barna er det søkt om asyl for?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    kontantstøtteFraAnnetEøsland: {
                        label: {
                            en: 'For which of the children are you receiving, have received or have applied for child benefit?',
                            nb: 'Hvem av barna får du, har du fått eller har du søkt om barnetrygd for?',
                            nn: 'Kven av barna får du, har du fått eller har du søkt om barnetrygd for?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    andreForelderErDød: {
                        label: {
                            en: 'Which of the children is your previous spouse/cohabiting partner the parent of?',
                            nb: 'Hvem av barna er din tidligere ektefelle/samboer forelder til?',
                            nn: 'Kven av barna er din tidlegare ektefelle/sambuar forelder til?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    oppholderSegIInstitusjon: {
                        label: {
                            en: 'Which of the children are in an institution?',
                            nb: 'Hvem av barna er i institusjon?',
                            nn: 'Kven av barna er seg i institusjon?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    institusjonIUtland: {
                        label: {
                            en: 'The institution is outside of Norway',
                            nb: 'Institusjonen er i utlandet',
                            nn: 'Institusjonen er i utlandet',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    boddMindreEnn12MndINorge: {
                        label: {
                            en: 'Which of the children have stayed outside of Norway during the last twelve months?',
                            nb: 'Hvem av barna har oppholdt seg utenfor Norge i løpet av de siste tolv månedene?',
                            nn: 'Kven av barna har oppheldt seg utanfor Noreg i løpet av dei siste tolv månadene?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    borFastMedSøker: {
                        label: {
                            en: 'Does Barn 234567 89876 live with you on a permanent basis?',
                            nb: 'Bor Barn 234567 89876 fast sammen med deg?',
                            nn: 'Bur Barn 234567 89876 fast saman med deg?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    institusjonOppholdSluttdato: {
                        label: {
                            en: 'When is the stay at the institution ending?',
                            nb: 'Når avsluttes institusjonsoppholdet?',
                            nn: 'Når avsluttast institusjonsopphaldet?',
                        },
                        verdi: { nb: '', nn: '', en: '' },
                    },
                    adresse: {
                        label: {
                            en: "Where is Barn 234567 89876's living during the period for which you are applying for child benefit?",
                            nb: 'Hvor bor Barn 234567 89876 i perioden det søkes om barnetrygd?',
                            nn: 'Kor bur Barn 234567 89876 i perioden det vert søkt om barnetrygd?',
                        },
                        verdi: { nb: 'Vei 12', nn: 'Vei 12', en: 'Vei 12' },
                    },
                },
            },
            {
                harEøsSteg: true,
                navn: {
                    label: { en: 'Name', nb: 'Navn', nn: 'Namn' },
                    verdi: {
                        nb: 'Barn Barnessen III',
                        nn: 'Barn Barnessen III',
                        en: 'Barn Barnessen III',
                    },
                },
                ident: {
                    label: { en: 'Ident', nb: 'Ident', nn: 'Ident' },
                    verdi: { nb: '12345678987', nn: '12345678987', en: '12345678987' },
                },
                registrertBostedType: {
                    label: {
                        en: 'Registered place of residence',
                        nb: 'Registrert bosted',
                        nn: 'Registrert bustad',
                    },
                    verdi: {
                        nb: 'REGISTRERT_SOKERS_ADRESSE',
                        nn: 'REGISTRERT_SOKERS_ADRESSE',
                        en: 'REGISTRERT_SOKERS_ADRESSE',
                    },
                },
                alder: {
                    label: { en: 'Age', nb: 'Alder', nn: 'Alder' },
                    verdi: { en: '12 years', nb: '12 år', nn: '12 år' },
                },
                utenlandsperioder: [
                    {
                        label: {
                            en: 'Stay abroad 1',
                            nb: 'Utenlandsopphold 1',
                            nn: 'Utanlandsopphald 1',
                        },
                        verdi: {
                            nb: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period Barn Barnessen III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden Barn Barnessen III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden Barn Barnessen III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child has stayed outside of Norway earlier',
                                        nb: 'Barnet har oppholdt seg utenfor Norge tidligere',
                                        nn: 'Barnet har opphalde meg utanfor Noreg tidlegare',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country was Barn Barnessen III staying in?',
                                        nb: 'Hvilket land oppholdt Barn Barnessen III seg i?',
                                        nn: 'Kva land oppheldt Barn Barnessen III seg i?',
                                    },
                                    verdi: { nb: 'Belgia', nn: 'Belgia', en: 'Belgium' },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: { nb: '2022-01-11', nn: '2022-01-11', en: '2022-01-11' },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When did the stay end?',
                                        nb: 'Når ble oppholdet avsluttet?',
                                        nn: 'Når blei opphaldet avslutta?',
                                    },
                                    verdi: { nb: '2022-01-19', nn: '2022-01-19', en: '2022-01-19' },
                                },
                            },
                            nn: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period Barn Barnessen III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden Barn Barnessen III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden Barn Barnessen III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child has stayed outside of Norway earlier',
                                        nb: 'Barnet har oppholdt seg utenfor Norge tidligere',
                                        nn: 'Barnet har opphalde meg utanfor Noreg tidlegare',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country was Barn Barnessen III staying in?',
                                        nb: 'Hvilket land oppholdt Barn Barnessen III seg i?',
                                        nn: 'Kva land oppheldt Barn Barnessen III seg i?',
                                    },
                                    verdi: { nb: 'Belgia', nn: 'Belgia', en: 'Belgium' },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: { nb: '2022-01-11', nn: '2022-01-11', en: '2022-01-11' },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When did the stay end?',
                                        nb: 'Når ble oppholdet avsluttet?',
                                        nn: 'Når blei opphaldet avslutta?',
                                    },
                                    verdi: { nb: '2022-01-19', nn: '2022-01-19', en: '2022-01-19' },
                                },
                            },
                            en: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period Barn Barnessen III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden Barn Barnessen III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden Barn Barnessen III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child has stayed outside of Norway earlier',
                                        nb: 'Barnet har oppholdt seg utenfor Norge tidligere',
                                        nn: 'Barnet har opphalde meg utanfor Noreg tidlegare',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country was Barn Barnessen III staying in?',
                                        nb: 'Hvilket land oppholdt Barn Barnessen III seg i?',
                                        nn: 'Kva land oppheldt Barn Barnessen III seg i?',
                                    },
                                    verdi: { nb: 'Belgia', nn: 'Belgia', en: 'Belgium' },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: { nb: '2022-01-11', nn: '2022-01-11', en: '2022-01-11' },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When did the stay end?',
                                        nb: 'Når ble oppholdet avsluttet?',
                                        nn: 'Når blei opphaldet avslutta?',
                                    },
                                    verdi: { nb: '2022-01-19', nn: '2022-01-19', en: '2022-01-19' },
                                },
                            },
                        },
                    },
                ],
                eøsKontantstøttePerioder: [],
                barnehageplassPerioder: [],
                idNummer: [],
                andreForelder: {
                    kanIkkeGiOpplysninger: {
                        label: {
                            en: 'I am unable to provide information about the other parent',
                            nb: 'Jeg kan ikke gi opplysninger om den andre forelderen',
                            nn: 'Eg kan ikkje gje opplysningar om den andre forelderen',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    navn: {
                        label: { en: 'Name', nb: 'Navn', nn: 'Namn' },
                        verdi: {
                            nb: 'gdjhrstjsrthrfgfdgfdgdf',
                            nn: 'gdjhrstjsrthrfgfdgfdgdf',
                            en: 'gdjhrstjsrthrfgfdgfdgdf',
                        },
                    },
                    fnr: {
                        label: {
                            en: 'Norwegian National identity number or D number',
                            nb: 'Fødselsnummer eller d-nummer',
                            nn: 'Fødselsnummer eller d-nummer',
                        },
                        verdi: {
                            en: "I don't know their National identity number or-D number",
                            nb: 'Jeg kjenner ikke fødselsnummer eller d-nummer',
                            nn: 'Eg kjenner ikkje fødselsnummer eller d-nummer',
                        },
                    },
                    fødselsdato: {
                        label: { en: 'Date of birth', nb: 'Fødselsdato', nn: 'Fødselsdato' },
                        verdi: { nb: '1992-01-09', nn: '1992-01-09', en: '1992-01-09' },
                    },
                    værtINorgeSisteTolvMåneder: {
                        label: {
                            en: 'todo.andreforelder.utenlandsopphold',
                            nb: 'TODO andre forelder utenlandsopphold',
                            nn: 'todo.andreforelder.utenlandsopphold',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    utenlandsperioder: [],
                    planleggerÅBoINorgeTolvMnd: {
                        label: {
                            en: 'todo.andreforelder.utenlandsopphold',
                            nb: 'TODO andre forelder utenlandsopphold',
                            nn: 'todo.andreforelder.utenlandsopphold',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    yrkesaktivFemÅr: {
                        label: {
                            en: 'TODO andre forelder yrkesaktiv',
                            nb: 'TODO andre forelder yrkesaktiv',
                            nn: 'TODO andre forelder yrkesaktiv',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    pensjonUtland: {
                        label: {
                            en: "Does Barn Barnessen III's other parent receive, or have they received a pension from abroad?",
                            nb: 'Får eller har den andre forelderen til Barn Barnessen III fått pensjon fra utlandet?',
                            nn: 'Får eller har den andre forelderen til Barn Barnessen III fått pensjon frå utlandet?',
                        },
                        verdi: { nb: 'VET_IKKE', nn: 'VET_IKKE', en: 'VET_IKKE' },
                    },
                    arbeidUtlandet: {
                        label: {
                            en: "Does Barn Barnessen III's other parent work, or have they worked outside of Norway, on a foreign ship or on a foreign continental shelf?",
                            nb: 'Arbeider eller har den andre forelderen til Barn Barnessen III arbeidet utenfor Norge, på utenlandsk skip eller på utenlandsk kontinentalsokkel?',
                            nn: 'Arbeider eller har den andre forelderen til Barn Barnessen III arbeidt utanfor Noreg, på utanlandsk skip eller på utanlandsk kontinentalsokkel?',
                        },
                        verdi: { nb: 'VET_IKKE', nn: 'VET_IKKE', en: 'VET_IKKE' },
                    },
                    pensjonNorge: {
                        label: {
                            en: "Does Barn Barnessen III's other parent receive, or have they received a pension from Norway?",
                            nb: 'Får eller har Barn Barnessen III sin andre forelder fått pensjon fra Norge?',
                            nn: 'Får eller har Barn Barnessen III sin andre forelder fått pensjon frå Noreg?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    arbeidNorge: {
                        label: {
                            en: "Does Barn Barnessen III's other parent work, or have they worked in Norway, on the Norwegian continental shelf or on a ship flying the Norwegian flag?",
                            nb: 'Arbeider eller har den andre forelderen til Barn Barnessen III arbeidet i Norge, på norsk kontinentalsokkel eller på skip som fører norsk flagg?',
                            nn: 'Arbeider eller har den andre forelderen til Barn Barnessen III arbeidt i Noreg, på norsk kontinentalsokkel eller på skip som fører norsk flagg?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    andreUtbetalinger: {
                        label: {
                            en: "Does Barn Barnessen III's other parent receive, or have they received benefits that replace income from Norway and/or another EEA member state?",
                            nb: 'Får eller har Barn Barnessen III sin andre forelder fått utbetalinger som erstatter arbeidsinntekt fra Norge og/eller andre EØS-land?',
                            nn: 'Får eller har Barn Barnessen III sin andre forelder fått utbetalingar som erstattar arbeidsinntekt frå Noreg og/eller andre EØS-land?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    pågåendeSøknadFraAnnetEøsLand: {
                        label: {
                            en: "Does Barn Barnessen III's other parent have an active application for child benefit from another EEA country?",
                            nb: 'Har Barn Barnessen III sin andre forelder en pågående søknad om barnetrygd fra et annet EU/EØS land?',
                            nn: 'Har Barn Barnessen III sin andre forelder ein pågåande søknad om barnetrygd frå eit anna EU/EØS-land?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    pågåendeSøknadHvilketLand: {
                        label: {
                            en: "What country has Barn Barnessen III's other parent applied for child benefit from?",
                            nb: 'Hvilket land har Barn Barnessen III sin andre forelder søkt om barnetrygd fra?',
                            nn: 'Kva land har Barn Barnessen III sin andre forelder søkt om barnetrygd frå?',
                        },
                        verdi: { nb: 'Belgia', nn: 'Belgia', en: 'Belgium' },
                    },
                    kontantstøtteFraEøs: {
                        label: {
                            en: "Is Barn Barnessen III's other parent receiving or have they received child benefit from another EEA country?",
                            nb: 'Får eller har Barn Barnessen III sin andre forelder fått barnetrygd fra et annet EU/EØS land?',
                            nn: 'Får eller har Barn Barnessen III sin andre forelder fått barnetrygd frå eit anna EU/EØS-land?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    adresse: {
                        label: {
                            en: "Where is Barn Barnessen III's other parent living during the period for which you are applying for child benefit?",
                            nb: 'Hvor bor Barn Barnessen III sin andre forelder i perioden det søkes om barnetrygd?',
                            nn: 'Kor bur Barn Barnessen III sin andre forelder i perioden det vert søkt om barnetrygd?',
                        },
                        verdi: {
                            nb: 'Heisannveien 14',
                            nn: 'Heisannveien 14',
                            en: 'Heisannveien 14',
                        },
                    },
                    arbeidsperioderUtland: [],
                    pensjonsperioderUtland: [],
                    arbeidsperioderNorge: [],
                    pensjonsperioderNorge: [],
                    andreUtbetalingsperioder: [],
                    eøsKontantstøttePerioder: [],
                    idNummer: [],
                },
                omsorgsperson: null,
                spørsmål: {
                    sammeForelderSomAnnetBarnMedId: {
                        label: {
                            en: "Who is Barn Barnessen III's other parent?",
                            nb: 'Hvem er Barn Barnessen III sin andre forelder?',
                            nn: 'Kven er Barn Barnessen III sin andre forelder?',
                        },
                        verdi: { nb: 'ANNEN_FORELDER', nn: 'ANNEN_FORELDER', en: 'ANNEN_FORELDER' },
                    },
                    erFosterbarn: {
                        label: {
                            en: 'Which of the children are foster children?',
                            nb: 'Hvem av barna er fosterbarn?',
                            nn: 'Kven av barna er fosterbarn?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    erAdoptert: {
                        label: {
                            en: 'Which of the children are adopted from abroad?',
                            nb: 'Hvem av barna er adoptert fra utlandet?',
                            nn: 'Kven av barna er adoptert frå utlandet?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    erAsylsøker: {
                        label: {
                            en: 'For which of the children has an application for asylum been submitted?',
                            nb: 'Hvem av barna er det søkt om asyl for?',
                            nn: 'Kven av barna er det søkt om asyl for?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    kontantstøtteFraAnnetEøsland: {
                        label: {
                            en: 'For which of the children are you receiving, have received or have applied for child benefit?',
                            nb: 'Hvem av barna får du, har du fått eller har du søkt om barnetrygd for?',
                            nn: 'Kven av barna får du, har du fått eller har du søkt om barnetrygd for?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    andreForelderErDød: {
                        label: {
                            en: 'Which of the children is your previous spouse/cohabiting partner the parent of?',
                            nb: 'Hvem av barna er din tidligere ektefelle/samboer forelder til?',
                            nn: 'Kven av barna er din tidlegare ektefelle/sambuar forelder til?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    oppholderSegIInstitusjon: {
                        label: {
                            en: 'Which of the children are in an institution?',
                            nb: 'Hvem av barna er i institusjon?',
                            nn: 'Kven av barna er seg i institusjon?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    institusjonIUtland: {
                        label: {
                            en: 'The institution is outside of Norway',
                            nb: 'Institusjonen er i utlandet',
                            nn: 'Institusjonen er i utlandet',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    boddMindreEnn12MndINorge: {
                        label: {
                            en: 'Which of the children have stayed outside of Norway during the last twelve months?',
                            nb: 'Hvem av barna har oppholdt seg utenfor Norge i løpet av de siste tolv månedene?',
                            nn: 'Kven av barna har oppheldt seg utanfor Noreg i løpet av dei siste tolv månadene?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    planleggerÅBoINorge12Mnd: {
                        label: {
                            en: 'Is it planned that Barn Barnessen III will live in Norway continuously for more than 12 months?',
                            nb: 'Er det planlagt at Barn Barnessen III skal bo sammenhengende i Norge i mer enn tolv måneder?',
                            nn: 'Er det planlagd at Barn Barnessen III skal bu i Noreg samanhengande i meir enn tolv månadar?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    borFastMedSøker: {
                        label: {
                            en: 'Does Barn Barnessen III live with you on a permanent basis?',
                            nb: 'Bor Barn Barnessen III fast sammen med deg?',
                            nn: 'Bur Barn Barnessen III fast saman med deg?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    institusjonOppholdSluttdato: {
                        label: {
                            en: 'When is the stay at the institution ending?',
                            nb: 'Når avsluttes institusjonsoppholdet?',
                            nn: 'Når avsluttast institusjonsopphaldet?',
                        },
                        verdi: { nb: '', nn: '', en: '' },
                    },
                    adresse: {
                        label: {
                            en: "Where is Barn Barnessen III's living during the period for which you are applying for child benefit?",
                            nb: 'Hvor bor Barn Barnessen III i perioden det søkes om barnetrygd?',
                            nn: 'Kor bur Barn Barnessen III i perioden det vert søkt om barnetrygd?',
                        },
                        verdi: { nb: 'Vei 12', nn: 'Vei 12', en: 'Vei 12' },
                    },
                },
            },
        ],
        spørsmål: {
            erNoenAvBarnaFosterbarn: {
                label: {
                    en: 'Are any of the children foster children?',
                    nb: 'Er noen av barna fosterbarn?',
                    nn: 'Er nokre av barna fosterbarn?',
                },
                verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
            },
            søktAsylForBarn: {
                label: {
                    en: 'Has an application for asylum been submitted for any of the children?',
                    nb: 'Er det søkt om asyl i Norge for noen av barna?',
                    nn: 'Er det søkt om asyl i Noreg for nokre av barna?',
                },
                verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
            },
            oppholderBarnSegIInstitusjon: {
                label: {
                    en: 'Are any of the children in a child welfare institution or other institution?',
                    nb: 'Er noen av barna i barnverninstitusjon eller i annen institusjon?',
                    nn: 'Er nokre av barna i barneverninstitusjon eller i anna institusjon?',
                },
                verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                label: {
                    en: 'Have the children stayed continuously in Norway during the last twelve months?',
                    nb: 'Har barna oppholdt seg sammenhengende i Norge de siste tolv månedene?',
                    nn: 'Har barna oppheldt seg samanhengande i Noreg dei siste tolv månadene?',
                },
                verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
            },
            erBarnAdoptert: {
                label: {
                    en: 'Are any of the children adopted from abroad?',
                    nb: 'Er noen av barna adoptert fra utlandet?',
                    nn: 'Er nokre av barna adoptert frå utlandet?',
                },
                verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
            },
            mottarKontantstøtteForBarnFraAnnetEøsland: {
                label: {
                    en: 'Are you receiving, have you received or have you applied for child benefit for some of the children from another EEA country?',
                    nb: 'Får, har du fått eller har du søkt om barnetrygd for noen av barna fra et annet EØS land?',
                    nn: 'Får du, har du fått eller har du søkt om barnetrygd for nokre av barna frå eit anna EØS land?',
                },
                verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
            },
            harEllerTildeltBarnehageplass: {
                label: {
                    en: 'todo.ombarnadine.barnehageplass',
                    nb: 'TODO har, hatt eller tildelt barnehageplass',
                    nn: 'todo.ombarnadine.barnehageplass',
                },
                verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
            },
            erAvdødPartnerForelder: {
                label: {
                    en: 'You are registered as a widow/widower in the Norwegian National Registry (folkeregisteret). Is your previous spouse the parent of any of the children you are applying for child benefit for?',
                    nb: 'Du er folkeregistrert som enke/enkemann. Er din tidligere ektefelle forelder til noen av barna du søker barnetrygd for?',
                    nn: 'Du er folkeregistrert som enke/enkemann. Er din tidlegare ektefelle forelder til nokre av barna du søker barnetrygd for?',
                },
                verdi: { nb: null, nn: null, en: null },
            },
            lestOgForståttBekreftelse: {
                label: {
                    en: 'I am aware that I may lose my right to child benefit if I provide incorrect information. I am also aware that I will have to pay back any money I receive that I am not entitled to, that I have received if I have failed to provide information or have provided incorrect information.',
                    nb: 'Jeg er klar over at jeg kan miste retten til kontantstøtte dersom jeg gir feil opplysninger. Jeg er også klar over at jeg må betale tilbake dersom jeg får penger jeg ikke har rett til hvis jeg lar være å informere eller gir feil opplysninger.',
                    nn: 'Eg er klar over at eg kan miste retten til barnetrygd dersom eg gjev feil opplysningar. Eg er også klar over at eg må betale tilbake dersom eg får pengar eg ikkje har rett til hvis eg har latt vere å informere eller har gjeve feil opplysningar.',
                },
                verdi: {
                    en: 'I hereby confirm that I have read and understood.',
                    nb: 'Jeg bekrefter at jeg har lest og forstått.',
                    nn: 'Eg stadfestar at eg har lese og forstått',
                },
            },
        },
        dokumentasjon: [
            {
                dokumentasjonsbehov: 'BOR_FAST_MED_SØKER',
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        navn: 'sc1.jpeg',
                        dokumentId: '68e9f01c-6729-459e-8bab-0bf937d3597b',
                        tittel: 'BOR_FAST_MED_SØKER',
                    },
                ],
                dokumentasjonSpråkTittel: {
                    en: 'Confirmation that child lives with you',
                    nb: 'Bekreftelse på at barn bor sammen med deg',
                    nn: 'Stadfesting på at barn bur saman med deg',
                },
            },
            {
                dokumentasjonsbehov: 'ANNEN_DOKUMENTASJON',
                harSendtInn: false,
                opplastedeVedlegg: [],
                dokumentasjonSpråkTittel: {
                    en: 'Other documentation',
                    nb: 'Annen dokumentasjon',
                    nn: 'Anna dokumentasjon',
                },
            },
        ],
        teksterUtenomSpørsmål: {
            'hvilkebarn.barn.bosted.adressesperre': {
                en: 'The child is registered with a blocked address.',
                nb: 'Barnet er registrert med adressesperre.',
                nn: 'Barnet er registrert med adressesperre.',
            },
            'ombarnet.fosterbarn': {
                en: 'You have stated that {navn} is a foster child',
                nb: 'Du har opplyst at {navn} er fosterbarn',
                nn: 'Du har opplyst at {navn} er fosterbarn',
            },
            'ombarnet.institusjon': {
                en: 'You have stated that {navn} is in an institution',
                nb: 'Du har opplyst at {navn} er i institusjon',
                nn: 'Du har opplyst at {navn} er i institusjon',
            },
            'ombarnet.opplystatbarnutlandopphold.info': {
                en: 'You have stated that {navn} has stayed outside of Norway during the last twelve months',
                nb: 'Du har opplyst at {navn} har oppholdt seg utenfor Norge i løpet av de siste tolv månedene',
                nn: 'Du har opplyst at {navn} har oppheldt seg utanfor Noreg i løpet av dei siste tolv månadene',
            },
            'ombarnet.barnetrygd-eøs': {
                en: 'You have stated that you are receiving or have applied for child benefit for {navn} from another EEA country.',
                nb: 'Du har opplyst at du får eller har søkt om barnetrygd for {navn} fra et annet EØS land.',
                nn: 'Du har opplyst at du får eller har søkt om barnetrygd for {navn} frå eit anna EØS land.',
            },
            'omdeg.annensamboer.spm': {
                en: 'Have you had a cohabiting partner earlier during the period for which you are applying for child benefit?',
                nb: 'Har du hatt samboer tidligere i perioden du søker barnetrygd for?',
                nn: 'Har du hatt sambuar tidlegare i perioden du søker barnetrygd for?',
            },
            'omdeg.personopplysninger.adressesperre.alert': {
                en: 'You are registered with a blocked address',
                nb: 'Du er registrert med adressesperre',
                nn: 'Du er registrert med adressesperre',
            },
            'omdeg.personopplysninger.ikke-registrert.alert': {
                en: 'You are not registered with a residential address in Norway',
                nb: 'Du er ikke registrert med bostedsadresse i Norge',
                nn: 'Du er ikkje registrert med bustadsadresse i Noreg',
            },
            'pdf.andreforelder.seksjonstittel': {
                en: "Child's other parent",
                nb: 'Barnets andre forelder',
                nn: 'Barnet sin andre forelder',
            },
            'pdf.hvilkebarn.seksjonstittel': {
                en: 'Which children are you applying for?',
                nb: 'Hvilke barn søker du for?',
                nn: 'Kva barn søker du for?',
            },
            'pdf.hvilkebarn.registrert-på-adresse': {
                en: "Registered on applicant's address",
                nb: 'Registrert på søkers adresse',
                nn: 'Registrert på søkars adresse',
            },
            'pdf.hvilkebarn.ikke-registrert-på-adresse': {
                en: "Not registered on applicant's address",
                nb: 'Ikke registrert på søkers adresse',
                nn: 'Ikkje registrert på søkars adresse',
            },
            'pdf.ombarnet.seksjonstittel': { en: 'About {navn}', nb: 'Om {navn}', nn: 'Om {navn}' },
            'pdf.omdeg.seksjonstittel': { en: 'About you', nb: 'Om deg', nn: 'Om deg' },
            'pdf.bosted.seksjonstittel': { en: 'Place of residence', nb: 'Bosted', nn: 'Bustad' },
            'pdf.ombarna.seksjonstittel': {
                en: 'About your children',
                nb: 'Om barna dine',
                nn: 'Om barna dine',
            },
            'pdf.søker-for-tidsrom.seksjonstittel': {
                en: 'Are you applying for a specific time period for {navn}?',
                nb: 'Søker du barnetrygd for et spesielt tidsrom for {navn}?',
                nn: 'Søker du barnetrygd for eit spesielt tidsrom for {navn}?',
            },
            'pdf.søker.seksjonstittel': { en: 'Applicant', nb: 'Søker', nn: 'Søkar' },
            'pdf.vedlegg.seksjonstittel': {
                en: 'List of attachments',
                nb: 'Liste over vedlegg',
                nn: 'Liste over vedlegg',
            },
            'pdf.vedlegg.lastet-opp-antall': {
                en: 'Uploaded {antall} attachments',
                nb: 'Lastet opp {antall} vedlegg',
                nn: 'Lasta opp {antall} vedlegg',
            },
            'pdf.vedlegg.nummerering': {
                en: 'Attachment {x} of {total}',
                nb: 'Vedlegg {x} av {total}',
                nn: 'Vedlegg {x} av {total}',
            },
            'dokumentasjon.har-sendt-inn.spm': {
                en: 'I have already submitted this documentation to NAV in the past',
                nb: 'Jeg har sendt inn denne dokumentasjonen til NAV tidligere',
                nn: 'Eg har sendt inn denne dokumentasjonen til NAV tidlegare',
            },
            'dinlivssituasjon.sidetittel': {
                en: 'Your life situation',
                nb: 'Livssituasjonen din',
                nn: 'Livssituasjonen din',
            },
            'eøs-om-deg.sidetittel': {
                en: 'Child benefit by the EEA-regulations - About you',
                nb: 'Barnetrygd etter EØS-reglene - Om deg',
                nn: 'Barnetrygd etter EØS-reglane - Om deg',
            },
            'eøs-om-barn.sidetittel': {
                en: 'Child benefit by the EEA-regulations - About {barn}',
                nb: 'Barnetrygd etter EØS-reglene - Om {barn}',
                nn: 'Barnetrygd etter EØS-reglane - Om {barn}',
            },
            'felles.svaralternativ.ja': { en: 'Yes', nb: 'Ja', nn: 'Ja' },
            'felles.svaralternativ.nei': { en: 'No', nb: 'Nei', nn: 'Nei' },
            'felles.svaralternativ.vetikke': {
                en: "Don't know",
                nb: 'Jeg vet ikke',
                nn: 'Eg veit ikkje',
            },
        },
        originalSpråk: 'nb',
    },
};
