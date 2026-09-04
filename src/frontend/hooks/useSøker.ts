import { useSøkerContext } from '../context/SøkerContext';

export function useSøker() {
    const { søker } = useSøkerContext();
    return søker;
}
