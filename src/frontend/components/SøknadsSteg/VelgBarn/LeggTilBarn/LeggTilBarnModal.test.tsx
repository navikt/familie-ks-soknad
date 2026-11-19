import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';

import { spyOnUseApp, TestProvidere } from '../../../../utils/testing';

import LeggTilBarnModal from './LeggTilBarnModal';

describe('LeggTilBarnModal', () => {
    test('Godtar fødselsnummer med mellomrom og lagrer det uten mellomrom', async () => {
        const { settSøknad } = spyOnUseApp({ barnRegistrertManuelt: [], søker: { barn: [] } });
        const lukkModal = vi.fn();

        render(
            <TestProvidere>
                <LeggTilBarnModal erÅpen={true} lukkModal={lukkModal} />
            </TestProvidere>
        );

        const modal = within(screen.getByRole('dialog'));

        act(() => {
            fireEvent.input(modal.getByLabelText('FELLES.modaler.leggTilBarn.fornavn.sporsmal'), {
                target: { value: 'Sirius' },
            });
            fireEvent.input(modal.getByLabelText('FELLES.modaler.leggTilBarn.etternavn.sporsmal'), {
                target: { value: 'Svaart' },
            });
            fireEvent.input(modal.getByLabelText('FELLES.modaler.leggTilBarn.foedselsnummerEllerDNummer.sporsmal'), {
                target: { value: ' 010120 10059 ' },
            });
        });

        act(() => modal.getByRole('button', { name: 'FELLES.modaler.leggTilBarn.leggTilKnapp' }).click());

        await waitFor(() => expect(lukkModal).toHaveBeenCalled());
        expect(settSøknad).toHaveBeenCalledWith(
            expect.objectContaining({
                barnRegistrertManuelt: [expect.objectContaining({ ident: '01012010059' })],
            })
        );
    });
});
