import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { PersonType } from '../../../../typer/personType';
import { RouteEnum } from '../../../../typer/routes';
import { genererAdresseVisning } from '../../../../utils/adresse';
import { landkodeTilSpråk } from '../../../../utils/språk';
import { jaNeiSvarTilSpråkId } from '../../../../utils/spørsmål';
import { UtenlandsperiodeOppsummering } from '../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { useOmdeg } from '../../OmDeg/useOmdeg';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

const StyledUtenlandsperiodeOppsummering = styled(UtenlandsperiodeOppsummering)`
    border-bottom: none;
`;

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const OmDegOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster, plainTekst } = useApp();
    const { OM_DEG: omDegTekster, FORSIDE: forsideTekster } = tekster();
    const [valgtLocale] = useSprakContext();
    const { formatMessage } = useIntl();
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const omDegHook = useOmdeg();

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.OmDeg)}
            tittel={plainTekst(omDegTekster.omDegTittel)}
            skjemaHook={omDegHook}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    spørsmålstekst={forsideTekster.bekreftelsesboksBroedtekst}
                    søknadsvar={formatMessage({
                        id: søknad.lestOgForståttBekreftelse
                            ? 'forside.bekreftelsesboks.erklæring.spm'
                            : jaNeiSvarTilSpråkId(ESvar.NEI),
                    })}
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
                    søknadsvar={søknad.søker.sivilstand.type}
                />

                <OppsummeringFelt
                    spørsmålstekst={omDegTekster.adresse}
                    children={genererAdresseVisning(søknad.søker)}
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
                {søknad.søker.utenlandsperioder.map((periode, index) => (
                    <StyledUtenlandsperiodeOppsummering
                        key={index}
                        periode={periode}
                        nummer={index + 1}
                        personType={PersonType.søker}
                    />
                ))}
                {søknad.søker.planleggerÅBoINorgeTolvMnd.svar && (
                    <OppsummeringFelt
                        spørsmålstekst={omDegTekster.planleggerAaBoSammenhengende.sporsmal}
                        søknadsvar={søknad.søker.planleggerÅBoINorgeTolvMnd.svar}
                    />
                )}
                <OppsummeringFelt
                    spørsmålstekst={omDegTekster.medlemAvFolketrygden.sporsmal}
                    søknadsvar={søknad.søker.yrkesaktivFemÅr.svar}
                />
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default OmDegOppsummering;
