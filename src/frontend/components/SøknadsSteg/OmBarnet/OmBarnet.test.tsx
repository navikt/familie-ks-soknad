import React from 'react';

import { act, render } from '@testing-library/react';
import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
} from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { Slektsforhold } from '../../../typer/kontrakt/generelle';
import {
    mekkGyldigSøknad,
    mockEøs,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import { EøsBarnSpørsmålId } from '../EøsSteg/Barn/spørsmål';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import OmBarnet from './OmBarnet';
import { OmBarnetSpørsmålsId } from './spørsmål';

silenceConsoleErrors();

const mockBarnMedISøknad = {
    barnErFyltUt: true,
    triggetEøs: true,
    utenlandsperioder: [],
    eøsKontantstøttePerioder: [],
    barnehageplassPerioder: [],
    idNummer: [],
    borMedSøker: true,
    alder: '13',
    adressebeskyttelse: false,
    [barnDataKeySpørsmål.erFosterbarn]: {
        id: OmBarnaDineSpørsmålId.hvemErFosterbarn,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.erAdoptertFraUtland]: {
        id: OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.erAsylsøker]: {
        id: OmBarnaDineSpørsmålId.hvemErSøktAsylFor,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.harBarnehageplass]: {
        id: OmBarnaDineSpørsmålId.hvemBarnehageplass,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: {
        id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
        svar: ESvar.JA,
    },
    [barnDataKeySpørsmål.utbetaltForeldrepengerEllerEngangsstønad]: {
        id: OmBarnetSpørsmålsId.utbetaltForeldrepengerEllerEngangsstønad,
        svar: null,
    },
    [barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: {
        id: OmBarnetSpørsmålsId.pågåendeSøknadFraAnnetEøsLand,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.pågåendeSøknadHvilketLand]: {
        id: OmBarnetSpørsmålsId.pågåendeSøknadHvilketLand,
        svar: 'AUS' as Alpha3Code,
    },
    [barnDataKeySpørsmål.søkersSlektsforhold]: {
        id: EøsBarnSpørsmålId.søkersSlektsforhold,
        svar: Slektsforhold.BESTEFORELDER,
    },
    [barnDataKeySpørsmål.søkersSlektsforholdSpesifisering]: {
        id: EøsBarnSpørsmålId.søkersSlektsforholdSpesifisering,
        svar: '',
    },
    [barnDataKeySpørsmål.institusjonIUtland]: {
        id: OmBarnetSpørsmålsId.institusjonIUtland,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.institusjonsnavn]: {
        id: OmBarnetSpørsmålsId.institusjonsnavn,
        svar: 'narvesen',
    },
    [barnDataKeySpørsmål.institusjonsadresse]: {
        id: OmBarnetSpørsmålsId.institusjonsadresse,
        svar: 'narvesen',
    },
    [barnDataKeySpørsmål.institusjonspostnummer]: {
        id: OmBarnetSpørsmålsId.institusjonspostnummer,
        svar: '2030',
    },
    [barnDataKeySpørsmål.institusjonOppholdStartdato]: {
        id: OmBarnetSpørsmålsId.institusjonOppholdStartdato,
        svar: '2020-08-08',
    },
    [barnDataKeySpørsmål.institusjonOppholdSluttdato]: {
        id: OmBarnetSpørsmålsId.institusjonOppholdSluttdato,
        svar: AlternativtSvarForInput.UKJENT,
    },
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: {
        id: OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd,
        svar: ESvar.JA,
    },
    [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: {
        id: OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland]: {
        id: OmBarnaDineSpørsmålId.mottarKontantstøtteForBarnFraAnnetEøsland,
        svar: ESvar.JA,
    },
    [barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte]: {
        id: OmBarnetSpørsmålsId.mottarEllerMottokEøsKontantstøtte,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.borFastMedSøker]: {
        id: OmBarnetSpørsmålsId.borFastMedSøker,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId]: {
        id: OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn,
        svar: null,
    },
    [barnDataKeySpørsmål.andreForelderErDød]: {
        id: OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.borMedAndreForelder]: {
        id: EøsBarnSpørsmålId.borMedAndreForelder,
        svar: ESvar.NEI,
    },
    [barnDataKeySpørsmål.borMedOmsorgsperson]: {
        id: EøsBarnSpørsmålId.borMedOmsorgsperson,
        svar: ESvar.NEI,
    },
    andreForelder: {
        kanIkkeGiOpplysninger: {
            id: OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger,
            svar: ESvar.NEI,
        },
        idNummer: [],
        arbeidsperioderNorge: [],
        andreUtbetalingsperioder: [],
        arbeidsperioderUtland: [],
        pensjonsperioderNorge: [],
        pensjonsperioderUtland: [],
        eøsKontantstøttePerioder: [],
        kontantstøtteFraEøs: {
            id: EøsBarnSpørsmålId.andreForelderKontantstøtte,
            svar: ESvar.NEI,
        },
        pågåendeSøknadFraAnnetEøsLand: {
            id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadFraAnnetEøsLand,
            svar: ESvar.NEI,
        },
        pågåendeSøknadHvilketLand: {
            id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadHvilketLand,
            svar: '' as Alpha3Code,
        },
        adresse: {
            id: EøsBarnSpørsmålId.andreForelderAdresse,
            svar: AlternativtSvarForInput.UKJENT,
        },
        navn: {
            id: OmBarnetSpørsmålsId.andreForelderNavn,
            svar: 'Andre forelder',
        },
        fnr: {
            id: OmBarnetSpørsmålsId.andreForelderFnr,
            svar: AlternativtSvarForInput.UKJENT,
        },
        fødselsdato: {
            id: OmBarnetSpørsmålsId.andreForelderFødselsdato,
            svar: AlternativtSvarForInput.UKJENT,
        },
        yrkesaktivFemÅr: {
            id: OmBarnetSpørsmålsId.andreForelderYrkesaktivFemÅr,
            svar: ESvar.JA,
        },
        arbeidUtlandet: {
            id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
            svar: ESvar.NEI,
        },
        arbeidNorge: {
            id: EøsBarnSpørsmålId.andreForelderArbeidNorge,
            svar: ESvar.JA,
        },
        pensjonNorge: {
            id: EøsBarnSpørsmålId.andreForelderPensjonNorge,
            svar: ESvar.JA,
        },
        andreUtbetalinger: {
            id: EøsBarnSpørsmålId.andreForelderAndreUtbetalinger,
            svar: ESvar.NEI,
        },
        pensjonUtland: {
            id: OmBarnetSpørsmålsId.andreForelderPensjonUtland,
            svar: ESvar.VET_IKKE,
        },
        skriftligAvtaleOmDeltBosted: {
            id: OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted,
            svar: ESvar.NEI,
        },
    },
    omsorgsperson: {
        navn: {
            id: EøsBarnSpørsmålId.omsorgspersonNavn,
            svar: 'Test omsorgspersonen',
        },
        slektsforhold: {
            id: EøsBarnSpørsmålId.omsorgspersonSlektsforhold,
            svar: Slektsforhold.ANNEN_RELASJON,
        },
        slektsforholdSpesifisering: {
            id: EøsBarnSpørsmålId.søkersSlektsforholdSpesifisering,
            svar: 'Søskenbarn',
        },
        idNummer: {
            id: EøsBarnSpørsmålId.omsorgspersonIdNummer,
            svar: '12345678',
        },
        adresse: {
            id: EøsBarnSpørsmålId.omsorgspersonAdresse,
            svar: 'Oslogata 1',
        },
        arbeidsperioderNorge: [],
        andreUtbetalingsperioder: [],
        arbeidsperioderUtland: [],
        pensjonsperioderNorge: [],
        pensjonsperioderUtland: [],
        eøsKontantstøttePerioder: [],
        kontantstøtteFraEøs: {
            id: EøsBarnSpørsmålId.omsorgspersonKontantstøtte,
            svar: ESvar.NEI,
        },
        pågåendeSøknadFraAnnetEøsLand: {
            id: EøsBarnSpørsmålId.omsorgspersonPågåendeSøknadFraAnnetEøsLand,
            svar: ESvar.NEI,
        },
        pågåendeSøknadHvilketLand: {
            id: EøsBarnSpørsmålId.omsorgspersonPågåendeSøknadHvilketLand,
            svar: '' as Alpha3Code,
        },
        arbeidUtland: {
            id: EøsBarnSpørsmålId.omsorgspersonArbeidUtland,
            svar: ESvar.NEI,
        },
        arbeidNorge: {
            id: EøsBarnSpørsmålId.omsorgspersonArbeidNorge,
            svar: ESvar.JA,
        },
        pensjonNorge: {
            id: EøsBarnSpørsmålId.omsorgspersonPensjonNorge,
            svar: ESvar.JA,
        },
        andreUtbetalinger: {
            id: EøsBarnSpørsmålId.omsorgspersonAndreUtbetalinger,
            svar: ESvar.NEI,
        },
        pensjonUtland: {
            id: EøsBarnSpørsmålId.omsorgspersonPensjonUtland,
            svar: ESvar.VET_IKKE,
        },
    },
    adresse: {
        id: EøsBarnSpørsmålId.barnetsAdresse,
        svar: 'Osloveien',
    },
};

const jens: IBarnMedISøknad = {
    navn: 'Jens',
    id: 'random-id-jens',
    ident: '12345678910',
    ...mockBarnMedISøknad,
};

const line: IBarnMedISøknad = {
    navn: 'Line',
    id: 'random-id-line',
    ident: '12345678911',
    ...mockBarnMedISøknad,
};

describe('OmBarnet', () => {
    beforeEach(() => {
        mockEøs();
    });

    test(`Kan rendre Om Barnet og alle tekster finnes i språkfil`, async () => {
        mockHistory(['/om-barnet/barn-1']);
        spyOnUseApp({
            barnInkludertISøknaden: [jens],
            sisteUtfylteStegIndex: 4,
        });

        await act(async () => {
            render(
                <TestProvidereMedEkteTekster>
                    <OmBarnet barnetsId={'random-id-jens'} />
                </TestProvidereMedEkteTekster>
            );
        });

        expect(console.error).toHaveBeenCalledTimes(0);
    });

    test(`Kan navigere mellom to barn`, async () => {
        const { mockedHistoryArray } = mockHistory(['/om-barnet/barn-1']);
        spyOnUseApp({
            barnInkludertISøknaden: [jens, line],
            sisteUtfylteStegIndex: 4,
            dokumentasjon: [],
        });
        const { findByText } = render(
            <TestProvidere tekster={{ 'ombarnet.sidetittel': 'Om {navn}' }}>
                <OmBarnet barnetsId={'random-id-jens'} />
            </TestProvidere>
        );

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/om-barnet/barn-1');

        const jensTittel = await findByText('Om Jens');
        expect(jensTittel).toBeInTheDocument();

        const gåVidere = await findByText(/felles.navigasjon.gå-videre/);
        await act(() => gåVidere.click());

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/om-barnet/barn-2');
    });

    test(`Kan navigere fra barn til oppsummering`, async () => {
        const { mockedHistoryArray } = mockHistory(['/om-barnet/barn-1']);
        mockHistory(['/om-barnet/barn-1']);

        spyOnUseApp({
            barnInkludertISøknaden: [jens],
            sisteUtfylteStegIndex: 4,
            dokumentasjon: [],
        });

        const { findByText } = render(
            <TestProvidere tekster={{ 'ombarnet.sidetittel': 'Om {navn}' }}>
                <OmBarnet barnetsId={'random-id-jens'} />
            </TestProvidere>
        );

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/om-barnet/barn-1');

        const jensTittel = await findByText('Om Jens');
        expect(jensTittel).toBeInTheDocument();

        const gåVidere = await findByText(/felles.navigasjon.gå-videre/);
        await act(() => gåVidere.click());

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/oppsummering');
    });

    test('Fødselnummer til andre forelder blir fjernet om man huker av ikke oppgi opplysninger om den', async () => {
        mockHistory(['/om-barnet/barn-1']);

        spyOnUseApp({
            barnInkludertISøknaden: [
                {
                    ...jens,
                    andreForelder: {
                        ...jens.andreForelder,
                        [andreForelderDataKeySpørsmål.navn]: { id: '17', svar: '' },
                        [andreForelderDataKeySpørsmål.fnr]: { id: '18', svar: '' },
                    },
                },
            ],
            sisteUtfylteStegIndex: 4,
            dokumentasjon: [],
        });

        const { findByLabelText, findByText, queryByText } = render(
            <TestProvidere tekster={{ 'ombarnet.sidetittel': 'Om {navn}' }}>
                <OmBarnet barnetsId={'random-id-jens'} />
            </TestProvidere>
        );

        const ikkeOppgiOpplysninger = await findByLabelText(
            /ombarnet.andre-forelder.navn-ukjent.spm/
        );
        const andreForelderFnrLabel = await findByText(/felles.fødsels-eller-dnummer.label/);

        expect(queryByText(/felles.fødselsdato.label/)).not.toBeInTheDocument();
        expect(andreForelderFnrLabel).toBeInTheDocument();
        await act(() => ikkeOppgiOpplysninger.click());
        expect(andreForelderFnrLabel).not.toBeInTheDocument();
        expect(queryByText(/felles.fødselsdato.label/)).not.toBeInTheDocument();
    });

    test('Får opp feilmelding ved feil postnummer', async () => {
        mockHistory(['/om-barnet/barn-1']);

        //henter ut en gyldig søknad
        const søknadpostnummer = mekkGyldigSøknad();

        const barn: IBarnMedISøknad = søknadpostnummer.barnInkludertISøknaden[0];

        const endretBarn = {
            ...barn,

            institusjonspostnummer: {
                id: barnDataKeySpørsmål.institusjonspostnummer,
                svar: '12345678900',
            },
            oppholderSegIInstitusjon: {
                id: barnDataKeySpørsmål.oppholderSegIInstitusjon,
                svar: ESvar.JA,
            },
        };
        const oppdatertSøknad = { ...søknadpostnummer, barnInkludertISøknaden: [endretBarn] };
        const { erStegUtfyltFrafør } = spyOnUseApp(oppdatertSøknad);
        erStegUtfyltFrafør.mockReturnValue(false);

        const { queryByText, findAllByText } = render(
            <TestProvidere>
                <OmBarnet barnetsId={endretBarn.id} />
            </TestProvidere>
        );

        const gåVidereKnapper = queryByText(/felles.navigasjon.gå-videre/);
        expect(
            queryByText(/ombarnet.institusjon.postnummer.format.feilmelding/)
        ).not.toBeInTheDocument();

        act(() => {
            gåVidereKnapper && gåVidereKnapper.click();
        });
        const feilmelding = await findAllByText(
            /ombarnet.institusjon.postnummer.format.feilmelding/
        );
        expect(feilmelding).toHaveLength(2);
    });
});
