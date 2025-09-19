import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: unknown[]) => void>(funksjon: T, forsinkelseMs: number) {
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sistBrukteArgumenter = useRef<Parameters<T> | null>(null);

    const debouncedFunksjon = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }

            sistBrukteArgumenter.current = args;

            timeoutId.current = setTimeout(() => {
                funksjon(...args);
                timeoutId.current = null;
                sistBrukteArgumenter.current = null;
            }, forsinkelseMs);
        },
        [funksjon, forsinkelseMs]
    );

    const tvingKjøringAvDebouncedFunksjon = () => {
        if (timeoutId.current && sistBrukteArgumenter.current) {
            clearTimeout(timeoutId.current);
            funksjon(...sistBrukteArgumenter.current);
            timeoutId.current = null;
            sistBrukteArgumenter.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, []);

    return { debouncedFunksjon, tvingKjøringAvDebouncedFunksjon };
}
