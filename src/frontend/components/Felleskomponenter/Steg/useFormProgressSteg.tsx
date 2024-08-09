import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { LocaleRecordBlock } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import { ISteg, RouteEnum } from '../../../typer/routes';

interface IStegMedTittel extends ISteg {
    tittel: string;
}

export const useFormProgressSteg = (): IStegMedTittel[] => {
    const { tekster, plainTekst } = useApp();
    const { steg, barnForSteg } = useSteg();

    const {
        FORSIDE,
        OM_DEG,
        DIN_LIVSSITUASJON,
        VELG_BARN,
        OM_BARNA,
        OM_BARNET,
        OPPSUMMERING,
        DOKUMENTASJON,
        EØS_FOR_BARN,
        EØS_FOR_SØKER,
        KVITTERING,
    } = tekster();

    let antallBarnTellerOmBarnet = 0;
    let antallBarnTellerEøsForBarnet = 0;

    return steg
        .map(steg => {
            let tittelBlock: LocaleRecordBlock;
            let tittelFlettefeltVerider: FlettefeltVerdier | undefined = undefined;

            switch (steg.route) {
                case RouteEnum.Forside:
                    tittelBlock = FORSIDE.soeknadstittel;
                    break;
                case RouteEnum.OmDeg:
                    tittelBlock = OM_DEG.omDegTittel;
                    break;
                case RouteEnum.DinLivssituasjon:
                    tittelBlock = DIN_LIVSSITUASJON.dinLivssituasjonTittel;
                    break;
                case RouteEnum.VelgBarn:
                    tittelBlock = VELG_BARN.velgBarnTittel;
                    break;
                case RouteEnum.OmBarna:
                    tittelBlock = OM_BARNA.omBarnaTittel;
                    break;
                case RouteEnum.OmBarnet:
                    if (barnForSteg.length === 0) {
                        tittelBlock = OM_BARNET.omBarnetTittelUtenFlettefelt;
                    } else {
                        tittelBlock = OM_BARNET.omBarnetTittel;
                        tittelFlettefeltVerider = {
                            barnetsNavn: barnForSteg[antallBarnTellerOmBarnet].navn,
                        };
                        antallBarnTellerOmBarnet++;
                    }
                    break;
                case RouteEnum.EøsForSøker:
                    tittelBlock = EØS_FOR_SØKER.eoesForSoekerTittel;
                    break;
                case RouteEnum.EøsForBarn:
                    if (barnForSteg.length === 0) {
                        tittelBlock = EØS_FOR_BARN.eoesForBarnTittelUtenFlettefelt;
                    } else {
                        tittelBlock = EØS_FOR_BARN.eoesForBarnTittel;
                        tittelFlettefeltVerider = {
                            barnetsNavn: barnForSteg[antallBarnTellerEøsForBarnet].navn,
                        };
                        antallBarnTellerEøsForBarnet++;
                    }
                    break;
                case RouteEnum.Oppsummering:
                    tittelBlock = OPPSUMMERING.oppsummeringTittel;
                    break;
                case RouteEnum.Dokumentasjon:
                    tittelBlock = DOKUMENTASJON.dokumentasjonTittel;
                    break;
                case RouteEnum.Kvittering:
                    tittelBlock = KVITTERING.kvitteringTittel;
                    break;
                default:
                    // Alle routes i RouteEnum må gjennomgås i switch(), ellers feiler _exhaustiveCheck
                    const _exhaustiveCheck: never = steg.route;
                    return _exhaustiveCheck;
            }

            return {
                ...steg,
                tittel: plainTekst(tittelBlock, tittelFlettefeltVerider),
            };
        })
        .filter(steg => steg.route !== RouteEnum.Forside && steg.route !== RouteEnum.Kvittering);
};
