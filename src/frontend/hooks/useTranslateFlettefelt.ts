import { useLocale } from '@hooks/useLocale';
import { getName } from 'i18n-iso-countries';
import type { FlettefeltVerdier } from '../../common/typer/kontrakt/generelle';
import type { LocaleType } from '../../common/typer/locale';
import { useAppContext } from '../context/AppContext';
import { useSanityTekster } from '../context/SanityContext';
import { ESanityFlettefeltverdi, ESanitySteg } from '../typer/sanity/sanity';
import { plainTekstHof } from '../utils/sanity';

type TranslateFlettefelt = (
    sanityFlettefelt: ESanityFlettefeltverdi,
    flettefelter?: FlettefeltVerdier,
    spesifikkLocale?: LocaleType
) => string;

export function useTranslateFlettefelt(): TranslateFlettefelt {
    const { søknad } = useAppContext();

    const locale = useLocale();
    const fellestekster = useSanityTekster(ESanitySteg.FELLES);

    const plainTekst = plainTekstHof(flettefeltTilTekst, locale);

    function flettefeltTilTekst(
        sanityFlettefelt: ESanityFlettefeltverdi,
        flettefelter?: FlettefeltVerdier,
        spesifikkLocale?: LocaleType
    ): string {
        const frittståendeOrd = fellestekster.frittståendeOrd;
        switch (sanityFlettefelt) {
            case ESanityFlettefeltverdi.DATO:
                if (!flettefelter?.dato) {
                    throw Error('Flettefeltet dato ikke sendt med');
                }
                return flettefelter.dato;
            case ESanityFlettefeltverdi.KLOKKESLETT:
                if (!flettefelter?.klokkeslett) {
                    throw Error('Flettefeltet klokkeslett ikke sendt med');
                }
                return flettefelter.klokkeslett;
            case ESanityFlettefeltverdi.ANTALL:
                if (!flettefelter?.antall) {
                    throw Error('Flettefeltet antall ikke sendt med');
                }
                return flettefelter.antall;
            case ESanityFlettefeltverdi.TOTAL_ANTALL:
                if (!flettefelter?.totalAntall) {
                    throw Error('Flettefeltet totalAntall ikke sendt med');
                }
                return flettefelter.totalAntall;
            case ESanityFlettefeltverdi.SØKER_NAVN:
                return søknad.søker.navn;
            case ESanityFlettefeltverdi.BARN_NAVN:
                if (!flettefelter?.barnetsNavn) {
                    throw Error('Flettefeltet barnetsNavn ikke sendt med');
                }
                return flettefelter.barnetsNavn;
            case ESanityFlettefeltverdi.LAND:
                if (!flettefelter?.land) {
                    throw Error('Flettefeltet land ikke sendt med');
                }
                return getName(flettefelter.land, spesifikkLocale ?? locale) ?? flettefelter.land;
            case ESanityFlettefeltverdi.YTELSE:
                return plainTekst(frittståendeOrd.kontantstoette, undefined, spesifikkLocale ?? locale);
            case ESanityFlettefeltverdi.YTELSE_BESTEMT_FORM:
                return plainTekst(frittståendeOrd.kontantstoetten, undefined, spesifikkLocale ?? locale);
            case ESanityFlettefeltverdi.I_UTENFOR:
                return plainTekst(
                    flettefelter?.gjelderUtland ? frittståendeOrd.utenfor : frittståendeOrd.i,
                    undefined,
                    spesifikkLocale ?? locale
                );
            case ESanityFlettefeltverdi.UTLANDET_NORGE:
                return plainTekst(
                    flettefelter?.gjelderUtland ? frittståendeOrd.utlandet : frittståendeOrd.norge,
                    undefined,
                    spesifikkLocale ?? locale
                );
            case ESanityFlettefeltverdi.UTENLANDSK_NORSK:
                return plainTekst(
                    flettefelter?.gjelderUtland ? frittståendeOrd.utenlandsk : frittståendeOrd.norsk,
                    undefined,
                    spesifikkLocale ?? locale
                );
        }
    }

    return flettefeltTilTekst;
}
