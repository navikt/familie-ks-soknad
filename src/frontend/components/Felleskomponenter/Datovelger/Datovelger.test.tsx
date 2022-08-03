import React from 'react';

import { act, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { mockDeep } from 'jest-mock-extended';
import { IntlProvider } from 'react-intl';

import { ISODateString } from '@navikt/familie-form-elements';
import { ISkjema, useFelt } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import { dagensDato } from '../../../utils/dato';
import { silenceConsoleErrors, TestProvidere } from '../../../utils/testing';
import Datovelger from './Datovelger';

describe('Datovelger', () => {
    silenceConsoleErrors();
    test('Datovelger kan begrenses av annen fra om med datovelger', () => {
        const {
            result: { current },
        } = renderHook(
            () => {
                const fraOgMed = useFelt<ISODateString>({
                    verdi: '2021-09-10',
                    feltId: 'fra-og-med',
                });
                const tilOgMed = useFelt<ISODateString>({
                    verdi: '2021-09-10',
                    feltId: 'til-og-med',
                });
                return {
                    fraOgMed,
                    tilOgMed,
                };
            },
            { wrapper: IntlProvider, initialProps: { locale: 'nb' } }
        );

        const skjemaMock = mockDeep<ISkjema<SkjemaFeltTyper, string>>({
            visFeilmeldinger: true,
        });

        const { getAllByRole, container } = render(
            <TestProvidere>
                <Datovelger felt={current.fraOgMed} skjema={skjemaMock} label={'test-fra-og-med'} />
                <Datovelger
                    felt={current.tilOgMed}
                    tilhørendeFraOgMedFelt={current.fraOgMed}
                    skjema={skjemaMock}
                    label={'test-til-og-med'}
                />
            </TestProvidere>
        );

        const tilOgMedÅpneknapp = getAllByRole('button')[1];
        act(() => tilOgMedÅpneknapp.click());
        const forrigeDag =
            container.querySelector('[aria-selected="true"]')?.previousElementSibling;

        expect(forrigeDag?.getAttribute('aria-disabled')).toEqual('true');
    });

    it('kan avgrenses frem i tid', () => {
        const {
            result: { current },
        } = renderHook(
            () => {
                const tilOgMed = useFelt<ISODateString>({
                    verdi: dagensDato(),
                    feltId: 'til-og-med',
                });
                return {
                    tilOgMed,
                };
            },
            { wrapper: IntlProvider, initialProps: { locale: 'nb' } }
        );

        const skjemaMock = mockDeep<ISkjema<SkjemaFeltTyper, string>>({
            visFeilmeldinger: true,
        });

        const { getByRole, container } = render(
            <TestProvidere>
                <Datovelger
                    felt={current.tilOgMed}
                    skjema={skjemaMock}
                    label={'test-til-og-med'}
                    avgrensDatoFremITid={true}
                />
            </TestProvidere>
        );

        const datovelgerÅpneKnapp = getByRole('button');

        act(() => datovelgerÅpneKnapp.click());
        const nesteDag = container.querySelector('[aria-selected="true"]')?.nextElementSibling;
        expect(nesteDag?.getAttribute('aria-disabled')).toEqual('true');
    });
});

// TODO: Endre testene til å ikke bruke OmDeg for å teste Datovelger-komponenten

// describe('Test ulike caser for feilmelding hos datovelger', () => {
//     mockHistory(['/om-deg']);
//     const søknad = mekkGyldigSøknad();
//     const søknadMock = {
//         ...søknad,
//         søker: {
//             ...søknad.søker,
//             adressebeskyttelse: true,
//             statsborgerskap: [{ landkode: 'NOR' }],
//             oppholderSegINorge: {
//                 id: OmDegSpørsmålId.oppholderSegINorge,
//                 svar: ESvar.NEI,
//             },
//         },
//     };

//     it('Datovelger viser spesifikk feilmelding for felt dersom verdien er tom', () => {
//         spyOnUseApp({
//             ...søknadMock,
//             søker: {
//                 ...søknadMock.søker,
//                 oppholdslandDato: { id: OmDegSpørsmålId.oppholdslandDato, svar: '' },
//             },
//         });

//         const { getAllByText, getByText } = render(
//             <TestProvidereMedEkteTekster>
//                 <OmDeg />
//             </TestProvidereMedEkteTekster>
//         );
//         const gåVidere = getByText('Gå videre');
//         act(() => gåVidere.click());
//         const feilmelding = getAllByText(
//             'Du må oppgi når utenlandsoppholdet startet for å gå videre'
//         );
//         expect(feilmelding).toHaveLength(2);
//     });

//     it('Datovelger viser feilmelding for ugyldig valg av dato frem i tid', () => {
//         spyOnUseApp({
//             ...søknadMock,
//             søker: {
//                 ...søknadMock.søker,
//                 oppholdslandDato: {
//                     id: OmDegSpørsmålId.oppholdslandDato,
//                     svar: dayjs().add(1, 'day').format('YYYY-MM-DD'),
//                 },
//             },
//         });

//         const { getAllByText, getByText } = render(
//             <TestProvidereMedEkteTekster>
//                 <OmDeg />
//             </TestProvidereMedEkteTekster>
//         );
//         const gåVidere = getByText('Gå videre');
//         act(() => gåVidere.click());
//         const feilmelding = getAllByText('Dato kan ikke være frem i tid');
//         expect(feilmelding).toHaveLength(2);
//     });

//     it('Datovelger viser feilmelding for ugyldig format', () => {
//         spyOnUseApp({
//             ...søknadMock,
//             søker: {
//                 ...søknadMock.søker,
//                 oppholdslandDato: {
//                     id: OmDegSpørsmålId.oppholdslandDato,
//                     svar: 'abc',
//                 },
//             },
//         });

//         const { getAllByText, getByText } = render(
//             <TestProvidereMedEkteTekster>
//                 <OmDeg />
//             </TestProvidereMedEkteTekster>
//         );
//         const gåVidere = getByText('Gå videre');
//         act(() => gåVidere.click());
//         const feilmelding = getAllByText('Dato må være en gyldig dato i formatet dd.mm.åååå');
//         expect(feilmelding).toHaveLength(2);
//     });
// });
