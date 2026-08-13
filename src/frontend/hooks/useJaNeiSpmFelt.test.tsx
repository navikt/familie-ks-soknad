import type { ESvar } from '@navikt/familie-form-elements';
import { type Felt, Valideringsstatus } from '@navikt/familie-skjema';
import { renderHook } from '@testing-library/react';
import type { Alpha3Code } from 'i18n-iso-countries';
import { mock } from 'vitest-mock-extended';

import type { ISODateString } from '../../common/typer/ISODateString';
import type { LocaleRecordBlock } from '../../common/typer/locale';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { AppProvider } from '../context/AppContext';
import type { ISøknadSpørsmål } from '../typer/spørsmål';
import { TestProvidere } from '../utils/testing';

import useJaNeiSpmFelt, { erRelevanteAvhengigheterValidert } from './useJaNeiSpmFelt';

describe('erRelevanteAvhengigheterValidert', () => {
    test('Skal returnere true dersom alle felter er validert til OK', () => {
        const værtINorgeITolvMånederFeltMock = mock<Felt<ESvar | null>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholderSegINorgeFeltMock = mock<Felt<ESvar | null>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholdslandFeltMock = mock<Felt<Alpha3Code | ''>>({
            valideringsstatus: Valideringsstatus.OK,
            erSynlig: true,
        });
        const oppholdslandDatoFeltMock = mock<Felt<ISODateString>>({
            valideringsstatus: Valideringsstatus.OK,
            erSynlig: true,
        });

        const avhengigheterMock = {
            oppholderSegINorge: {
                hovedSpørsmål: oppholderSegINorgeFeltMock,
                tilhørendeFelter: [oppholdslandFeltMock, oppholdslandDatoFeltMock],
            },
            værtINorgeITolvMånederFeltMock: {
                hovedSpørsmål: værtINorgeITolvMånederFeltMock,
            },
        };
        expect(erRelevanteAvhengigheterValidert(avhengigheterMock)).toEqual(true);
    });

    test('Skal returnere false dersom tilhørende og relevant felt ikke er validert OK', () => {
        const værtINorgeITolvMånederFeltMock = mock<Felt<ESvar | null>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholderSegINorgeFeltMock = mock<Felt<ESvar | null>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholdslandFeltMock = mock<Felt<Alpha3Code | ''>>({
            valideringsstatus: Valideringsstatus.OK,
            erSynlig: true,
        });
        const oppholdslandDatoFeltMock = mock<Felt<ISODateString>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
            erSynlig: true,
        });

        const avhengigheterMock = {
            oppholderSegINorge: {
                hovedSpørsmål: oppholderSegINorgeFeltMock,
                tilhørendeFelter: [oppholdslandFeltMock, oppholdslandDatoFeltMock],
            },
            værtINorgeITolvMånederFeltMock: {
                hovedSpørsmål: værtINorgeITolvMånederFeltMock,
            },
        };
        expect(erRelevanteAvhengigheterValidert(avhengigheterMock)).toEqual(false);
    });

    test('Skal returnere false dersom et avhengig JaNeiSpm med tilhørende felter ikke er validert til OK', () => {
        const værtINorgeITolvMånederFeltMock = mock<Felt<ESvar | null>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholderSegINorgeFeltMock = mock<Felt<ESvar | null>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
        });
        const oppholdslandFeltMock = mock<Felt<Alpha3Code | ''>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
            erSynlig: false,
        });
        const oppholdslandDatoFeltMock = mock<Felt<ISODateString>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
            erSynlig: false,
        });

        const avhengigheterMock = {
            oppholderSegINorge: {
                hovedSpørsmål: oppholderSegINorgeFeltMock,
                tilhørendeFelter: [oppholdslandFeltMock, oppholdslandDatoFeltMock],
            },
            værtINorgeITolvMånederFeltMock: {
                hovedSpørsmål: værtINorgeITolvMånederFeltMock,
            },
        };
        expect(erRelevanteAvhengigheterValidert(avhengigheterMock)).toEqual(false);
    });

    test('Skal returnere false dersom et avhengig JaNeiSpm ikke er validert til OK', () => {
        const værtINorgeITolvMånederFeltMock = mock<Felt<ESvar | null>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
        });
        const oppholderSegINorgeFeltMock = mock<Felt<ESvar | null>>({
            valideringsstatus: Valideringsstatus.OK,
        });
        const oppholdslandFeltMock = mock<Felt<Alpha3Code | ''>>({
            valideringsstatus: Valideringsstatus.OK,
            erSynlig: false,
        });
        const oppholdslandDatoFeltMock = mock<Felt<ISODateString>>({
            valideringsstatus: Valideringsstatus.OK,
            erSynlig: false,
        });

        const avhengigheterMock = {
            oppholderSegINorge: {
                hovedSpørsmål: oppholderSegINorgeFeltMock,
                tilhørendeFelter: [oppholdslandFeltMock, oppholdslandDatoFeltMock],
            },
            værtINorgeITolvMånederFeltMock: {
                hovedSpørsmål: værtINorgeITolvMånederFeltMock,
            },
        };
        expect(erRelevanteAvhengigheterValidert(avhengigheterMock)).toEqual(false);
    });
});

describe('useJaNeiSpmFelt', () => {
    it('skjules når avhengighet ikke er validert', () => {
        const værtINorgeITolvMåneder: ISøknadSpørsmål<ESvar | null> = {
            id: OmDegSpørsmålId.værtINorgeITolvMåneder,
            svar: null,
        };

        const borPåRegistrertAdresseFeltMock = mock<Felt<ESvar | null>>({
            valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
        });

        const wrapper = ({ children }) => (
            <TestProvidere>
                <AppProvider>{children}</AppProvider>
            </TestProvidere>
        );

        const { result } = renderHook(
            () =>
                useJaNeiSpmFelt({
                    søknadsfelt: værtINorgeITolvMåneder,
                    feilmelding: {} as LocaleRecordBlock,
                    avhengigheter: {
                        borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresseFeltMock },
                    },
                    nullstillVedAvhengighetEndring: true,
                }),
            { wrapper }
        );

        expect(result.current.erSynlig).toEqual(false);
        expect(result.current.valideringsstatus).toEqual(Valideringsstatus.IKKE_VALIDERT);
        expect(result.current.verdi).toEqual(null);
    });
});
