import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { LocaleType } from '../../common/typer/locale';
import { useSpråkContext } from '../context/SpråkContext';

import { useLocale } from './useLocale';

vi.mock('../context/SpråkContext', () => ({
    useSpråkContext: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe('useLocale', () => {
    test('returnerer valgtLocale fra SpråkContext', () => {
        vi.mocked(useSpråkContext).mockReturnValue({
            valgtLocale: LocaleType.en,
            visSpråkvelger: vi.fn(),
            skjulSpråkvelger: vi.fn(),
        });

        const { result } = renderHook(() => useLocale());

        expect(result.current).toEqual(LocaleType.en);
    });

    test('returnerer nb når valgtLocale i SpråkContext er nb', () => {
        vi.mocked(useSpråkContext).mockReturnValue({
            valgtLocale: LocaleType.nb,
            visSpråkvelger: vi.fn(),
            skjulSpråkvelger: vi.fn(),
        });

        const { result } = renderHook(() => useLocale());

        expect(result.current).toEqual(LocaleType.nb);
    });
});
