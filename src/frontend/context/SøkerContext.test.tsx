import { renderHook } from '@testing-library/react';
import { lagSøker } from '@testutils/testdata/søkerTestdata';
import { SøkerProvider, useSøkerContext } from './SøkerContext';

describe('SøkerContext', () => {
    test('gir søker som blir sendt inn via providerens søker-prop', () => {
        const mockSøker = lagSøker();
        const wrapper = ({ children }) => <SøkerProvider søker={mockSøker}>{children}</SøkerProvider>;
        const { result } = renderHook(() => useSøkerContext(), { wrapper });

        expect(result.current.søker).toEqual(mockSøker);
    });

    test('kaster feil når useSøkerContext brukes utenfor SøkerProvider', () => {
        expect(() => renderHook(() => useSøkerContext())).toThrow(
            'useSøkerContext må brukes innenfor en SøkerProvider.'
        );
    });
});
