import { apiClient } from '@api/client/apiClient';
import axios from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { onRequestRejectedInterceptor, registerAxiosInterceptors } from './interceptors';

vi.mock('@api/client/apiClient', () => ({
    apiClient: {
        addResponseInterceptor: vi.fn(),
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe('registerAxiosInterceptors', () => {
    test('registrerer interceptor på axios og apiClient', () => {
        const axiosUseSpy = vi.spyOn(axios.interceptors.response, 'use').mockReturnValue(1);

        registerAxiosInterceptors();

        expect(axiosUseSpy).toHaveBeenCalledTimes(1);
        expect(axiosUseSpy).toHaveBeenCalledWith(expect.any(Function), onRequestRejectedInterceptor);

        expect(apiClient.addResponseInterceptor).toHaveBeenCalledTimes(1);
        expect(apiClient.addResponseInterceptor).toHaveBeenCalledWith({
            onRejected: onRequestRejectedInterceptor,
        });
    });
});
