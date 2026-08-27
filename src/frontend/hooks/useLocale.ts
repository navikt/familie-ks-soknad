import { useSpråkContext } from '../context/SpråkContext';

export function useLocale() {
    const { valgtLocale } = useSpråkContext();
    return valgtLocale;
}
