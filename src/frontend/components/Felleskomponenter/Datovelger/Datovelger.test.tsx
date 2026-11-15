import { type Felt, type ISkjema, useFelt } from '@navikt/familie-skjema';
import { fireEvent, render, screen } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import type { ISODateString } from '../../../../common/typer/ISODateString';
import type { SkjemaFeltTyper } from '../../../typer/skjema';
import { spyOnUseApp, TestProvidere } from '../../../utils/testing';

import Datovelger from './Datovelger';

const DatovelgerMedFelt = ({
    verdi,
    feltRef,
}: {
    verdi: ISODateString;
    feltRef: { current?: Felt<ISODateString> };
}) => {
    const felt = useFelt<ISODateString>({ verdi, feltId: 'dato', skalFeltetVises: () => true });
    feltRef.current = felt;
    const skjemaMock = mockDeep<ISkjema<SkjemaFeltTyper, string>>({ visFeilmeldinger: true });
    return <Datovelger felt={felt} skjema={skjemaMock} label={'dato'} />;
};

describe('Datovelger', () => {
    beforeEach(() => {
        spyOnUseApp({});
    });

    it('nullstiller feltet når datoen slettes fra input', () => {
        const feltRef: { current?: Felt<ISODateString> } = {};
        render(
            <TestProvidere>
                <DatovelgerMedFelt verdi={'2024-02-01'} feltRef={feltRef} />
            </TestProvidere>
        );

        fireEvent.change(screen.getByLabelText('dato'), { target: { value: '' } });

        expect(feltRef.current?.verdi).toBe('');
    });
});
