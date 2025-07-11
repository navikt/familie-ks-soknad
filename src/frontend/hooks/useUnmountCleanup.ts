import { useEffect, useRef } from 'react';

export function useUnmountCleanup() {
    const timerRefs = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
    const abortRequestRefs = useRef<Set<AbortController>>(new Set());

    function registerTimeoutUnmountHandler(timeout: ReturnType<typeof setTimeout>) {
        timerRefs.current.add(timeout);
    }

    function registerRequestUnmountHandler(controller: AbortController) {
        abortRequestRefs.current.add(controller);
    }

    function removeRequestUnmountHandler(controller: AbortController) {
        abortRequestRefs.current.delete(controller);
    }

    useEffect(() => {
        // Når komponenten unmountes bør vi cleare alle timeouts og requests
        return () => {
            for (const id of timerRefs.current) {
                clearTimeout(id);
            }

            for (const controller of abortRequestRefs.current) {
                controller.abort();
            }
        };
    }, []);

    return {
        registerTimeoutUnmountHandler,
        registerRequestUnmountHandler,
        removeRequestUnmountHandler,
    };
}
