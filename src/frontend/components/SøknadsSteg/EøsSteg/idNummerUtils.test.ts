import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { IArbeidsperiode, IPensjonsperiode, IUtenlandsperiode } from '../../../typer/perioder';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { mockEøs } from '../../../utils/testing';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import { PensjonsperiodeSpørsmålId } from '../../Felleskomponenter/Pensjonsmodal/spørsmål';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import {
    eøsLandUtenDuplikatHof,
    fjernDuplikat,
    idNummerLandMedPeriodeType,
    PeriodeType,
} from './idnummerUtils';

const arbeidsPeriodeMock = () => ({
    arbeidsperiodeland: {
        id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
        svar: 'NLD',
    },
    arbeidsgiver: { id: ArbeidsperiodeSpørsmålsId.arbeidsgiver, svar: '' },
    arbeidsperiodeAvsluttet: {
        id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet,
        svar: ESvar.NEI,
    },
    fraDatoArbeidsperiode: {
        id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode,
        svar: '',
    },
    tilDatoArbeidsperiode: {
        id: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
        svar: '',
    },
});

const pensjonsPeriodeMock = () => ({
    mottarPensjonNå: { id: PensjonsperiodeSpørsmålId.mottarPensjonNå, svar: ESvar.JA },
    pensjonsland: { id: PensjonsperiodeSpørsmålId.pensjonsland, svar: 'BGR' as Alpha3Code },
    pensjonFra: { id: PensjonsperiodeSpørsmålId.fraDatoPensjon, svar: '' },
    pensjonTil: { id: PensjonsperiodeSpørsmålId.tilDatoPensjon, svar: '' },
});

describe('idNummerLandMedPeriodeType', () => {
    it('Skal returnere idnummer-landMedPeriode til utenlandsperiode dersom det er flere like land på tvers av perioder', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'NLD', 'BGR'].includes(landKode));

        const utenlandsperioder: IUtenlandsperiode[] = [
            {
                utenlandsoppholdÅrsak: {
                    id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
                    svar: EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
                },
                oppholdsland: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: 'BGR' },
            },
        ];
        const arbeidsperioder: IArbeidsperiode[] = [
            {
                ...arbeidsPeriodeMock(),
                arbeidsperiodeland: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                    svar: 'BGR',
                },
            },
        ];
        const pensjonsperioder: IPensjonsperiode[] = [
            {
                ...pensjonsPeriodeMock(),
                mottarPensjonNå: { id: PensjonsperiodeSpørsmålId.mottarPensjonNå, svar: ESvar.JA },
                pensjonsland: { id: PensjonsperiodeSpørsmålId.pensjonsland, svar: 'BGR' },
            },
        ];

        expect(
            idNummerLandMedPeriodeType(
                {
                    arbeidsperioderUtland: arbeidsperioder,
                    pensjonsperioderUtland: pensjonsperioder,
                    utenlandsperioder,
                },
                erEøsLand
            )
        ).toEqual([{ land: 'BGR', periodeType: PeriodeType.utenlandsperiode }]);
    });

    it('Skal returnere idnummer-land til arbeidsperiode dersom landet og finnes i pensjonsperiode', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'NLD', 'BGR'].includes(landKode));

        const utenlandsperioder: IUtenlandsperiode[] = [];
        const arbeidsperioder: IArbeidsperiode[] = [
            {
                ...arbeidsPeriodeMock(),
                arbeidsperiodeland: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                    svar: 'BGR',
                },
            },
        ];
        const pensjonsperioder: IPensjonsperiode[] = [
            {
                ...pensjonsPeriodeMock(),
                mottarPensjonNå: { id: PensjonsperiodeSpørsmålId.mottarPensjonNå, svar: ESvar.JA },
                pensjonsland: { id: PensjonsperiodeSpørsmålId.pensjonsland, svar: 'BGR' },
            },
        ];

        expect(
            idNummerLandMedPeriodeType(
                {
                    arbeidsperioderUtland: arbeidsperioder,
                    pensjonsperioderUtland: pensjonsperioder,
                    utenlandsperioder,
                },
                erEøsLand
            )
        ).toEqual([{ land: 'BGR', periodeType: PeriodeType.arbeidsperiode }]);
    });

    it('Skal returnere en liste med 3 ulike land dersom det er satt 1 ulikt land på hver periode', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'NLD', 'BGR'].includes(landKode));

        const utenlandsperioder: IUtenlandsperiode[] = [
            {
                utenlandsoppholdÅrsak: {
                    id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
                    svar: EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
                },
                oppholdsland: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: 'BEL' },
            },
        ];
        const arbeidsperioder: IArbeidsperiode[] = [
            {
                ...arbeidsPeriodeMock(),
                arbeidsperiodeland: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                    svar: 'NLD',
                },
            },
        ];
        const pensjonsperioder: IPensjonsperiode[] = [
            {
                ...pensjonsPeriodeMock(),
                mottarPensjonNå: { id: PensjonsperiodeSpørsmålId.mottarPensjonNå, svar: ESvar.JA },
            },
        ];

        expect(
            idNummerLandMedPeriodeType(
                {
                    arbeidsperioderUtland: arbeidsperioder,
                    pensjonsperioderUtland: pensjonsperioder,
                    utenlandsperioder,
                },
                erEøsLand
            )
        ).toEqual([
            { land: 'NLD', periodeType: PeriodeType.arbeidsperiode },
            { land: 'BGR', periodeType: PeriodeType.pensjonsperiode },
            { land: 'BEL', periodeType: PeriodeType.utenlandsperiode },
        ]);
    });
});

describe('fjernDuplikat', () => {
    it('Skal returnere land kun 1 gang dersom det er flere like land i samme liste', () => {
        expect(fjernDuplikat(['BEL', 'BEL', 'NLD'])).toEqual(['BEL', 'NLD']);
    });
});

describe('eøsLandUtenDuplikatHof', () => {
    it('Skal returnere kun eøs land uten duplikater', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'NLD', 'BGR'].includes(landKode));

        const utenlandsperioderLand: Alpha3Code[] = ['BEL', 'AFG', 'BGR'];

        expect(eøsLandUtenDuplikatHof(erEøsLand)(utenlandsperioderLand)).toEqual(['BEL', 'BGR']);
    });
});
