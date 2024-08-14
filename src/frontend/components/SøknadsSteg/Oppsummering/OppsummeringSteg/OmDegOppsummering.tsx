import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { useSpråk } from '../../../../context/SpråkContext';
import { RouteEnum } from '../../../../typer/routes';
import { genererAdresseVisning } from '../../../../utils/adresse';
import { landkodeTilSpråk, sivilstandTilSanitySivilstandApiKey } from '../../../../utils/språk';
import { jaNeiSvarTilSpråkId } from '../../../../utils/spørsmål';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { useOmdeg } from '../../OmDeg/useOmdeg';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const OmDegOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster, plainTekst } = useApp();
    const {
        OM_DEG: omDegTekster,
        // FORSIDE: forsideTekster,
        FELLES: fellesTekster,
    } = tekster();
    const { valgtLocale } = useSpråk();
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const omDegHook = useOmdeg();

    /* 
    Vi oppretter midlertidige tekster som inneholder nye forside-tekster. 
    Når dette er ute i prod vil vi endre de eksisterende forsideteksene i Sanity (de som nå er utkommentert) slik at de blir likt det som ligger i de midlertidige tekstene. 
    Når dette er gjort lages en ny PR for å bytte koden tilbake til å bruke forsidetekstene. 
    */

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.OmDeg)}
            tittel={omDegTekster.omDegTittel}
            skjemaHook={omDegHook}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    // spørsmålstekst={forsideTekster.bekreftelsesboksBroedtekst}
                    tittel={
                        <TekstBlock
                            block={
                                fellesTekster.midlertidigeTekster.forsideBekreftelsesboksBroedtekst
                            }
                        />
                    }
                    søknadsvar={plainTekst(
                        søknad.lestOgForståttBekreftelse
                            ? // ? tekster().FORSIDE.bekreftelsesboksErklaering
                              fellesTekster.midlertidigeTekster.forsideBekreftelsesboksErklaering
                            : jaNeiSvarTilSpråkId(ESvar.NEI, tekster().FELLES.frittståendeOrd)
                    )}
                />
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    spørsmålstekst={omDegTekster.ident}
                    søknadsvar={søknad.søker.ident}
                />
                <OppsummeringFelt
                    spørsmålstekst={omDegTekster.statsborgerskap}
                    søknadsvar={søknad.søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                        )
                        .join(', ')}
                />
                <OppsummeringFelt
                    spørsmålstekst={omDegTekster.sivilstatus}
                    søknadsvar={plainTekst(
                        fellesTekster.frittståendeOrd[
                            sivilstandTilSanitySivilstandApiKey(søknad.søker.sivilstand.type)
                        ]
                    )}
                />

                <OppsummeringFelt
                    spørsmålstekst={omDegTekster.adresse}
                    children={genererAdresseVisning(søknad.søker, omDegTekster, plainTekst)}
                />
                {søknad.søker.borPåRegistrertAdresse.svar && (
                    <OppsummeringFelt
                        spørsmålstekst={omDegTekster.borPaaAdressen.sporsmal}
                        søknadsvar={søknad.søker.borPåRegistrertAdresse.svar}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>

            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    spørsmålstekst={omDegTekster.oppholdtDegSammenhengende.sporsmal}
                    søknadsvar={søknad.søker.værtINorgeITolvMåneder.svar}
                />
                <OppsummeringFelt
                    spørsmålstekst={omDegTekster.planleggerAaBoSammenhengende.sporsmal}
                    søknadsvar={søknad.søker.planleggerÅBoINorgeTolvMnd.svar}
                />
                <OppsummeringFelt
                    spørsmålstekst={omDegTekster.medlemAvFolketrygden.sporsmal}
                    søknadsvar={søknad.søker.yrkesaktivFemÅr.svar}
                />
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default OmDegOppsummering;
