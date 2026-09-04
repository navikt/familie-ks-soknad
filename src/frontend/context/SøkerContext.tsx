import { createContext, type PropsWithChildren, useContext } from 'react';
import type { ISøkerRespons } from '../typer/person';

interface SøkerContext {
    søker: ISøkerRespons;
}

const SøkerContext = createContext<SøkerContext | undefined>(undefined);

interface Props extends PropsWithChildren {
    søker: ISøkerRespons;
}

export function SøkerProvider({ søker, children }: Props) {
    return <SøkerContext.Provider value={{ søker }}>{children}</SøkerContext.Provider>;
}

export function useSøkerContext() {
    const context = useContext(SøkerContext);
    if (context === undefined) {
        throw new Error('useSøkerContext må brukes innenfor en SøkerProvider.');
    }
    return context;
}
