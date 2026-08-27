import { createContext, type PropsWithChildren, useContext } from 'react';
import type { ESanitySteg } from '../typer/sanity/sanity';
import type { ITekstinnhold } from '../typer/sanity/tekstInnhold';

interface SanityContext {
    tekster: ITekstinnhold;
}

const SanityContext = createContext<SanityContext | undefined>(undefined);

interface Props extends PropsWithChildren {
    tekster: ITekstinnhold;
}

export function SanityProvider({ tekster, children }: Props) {
    return <SanityContext.Provider value={{ tekster }}>{children}</SanityContext.Provider>;
}

export function useSanityContext() {
    const context = useContext(SanityContext);
    if (context === undefined) {
        throw new Error('useSanityContext må brukes innenfor en SanityProvider');
    }
    return context;
}

export function useSanityTekster<T extends ESanitySteg>(steg: T): ITekstinnhold[T] {
    const { tekster } = useSanityContext();
    return tekster[steg];
}
