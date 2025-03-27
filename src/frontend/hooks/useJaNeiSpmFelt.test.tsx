import React from 'react';

import { renderHook } from '@testing-library/react';
import { Alpha3Code } from 'i18n-iso-countries';
import { mock } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import { type Felt, Valideringsstatus } from '@navikt/familie-skjema';

import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { AppProvider } from '../context/AppContext';
import { InnloggetProvider } from '../context/InnloggetContext';
import { LastRessurserProvider } from '../context/LastRessurserContext';
import { SanityProvider } from '../context/SanityContext';
import { SpråkProvider } from '../context/SpråkContext';
import { ISODateString, LocaleRecordBlock } from '../typer/common';
import { ISøknadSpørsmål } from '../typer/spørsmål';

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
            <SpråkProvider>
                <LastRessurserProvider>
                    <InnloggetProvider>
                        <SanityProvider>
                            <AppProvider>{children}</AppProvider>
                        </SanityProvider>
                    </InnloggetProvider>
                </LastRessurserProvider>
            </SpråkProvider>
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
