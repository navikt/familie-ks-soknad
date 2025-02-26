import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { useRoutesContext } from '../../../../context/RoutesContext';
import { barnDataKeySpørsmål } from '../../../../typer/barn';
import { RouteEnum } from '../../../../typer/routes';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { OmBarnaDineSpørsmålId } from '../../OmBarnaDine/spørsmål';
import { useOmBarnaDine } from '../../OmBarnaDine/useOmBarnaDine';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const OmBarnaOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster } = useApp();
    const { hentRouteObjektForRouteEnum } = useRoutesContext();
    const omBarnaTekster = tekster().OM_BARNA;
    const omBarnaDineHook = useOmBarnaDine();

    const genererListeMedBarn = (søknadDatafelt: barnDataKeySpørsmål) =>
        søknad.barnInkludertISøknaden
            .filter(barn => barn[søknadDatafelt].svar === ESvar.JA)
            .map(filtrertBarn => filtrertBarn.navn)
            .join(', ');

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.OmBarna)}
            tittel={omBarnaTekster.omBarnaTittel}
            skjemaHook={omBarnaDineHook}
            settFeilAnchors={settFeilAnchors}
        >
            <OppsummeringFelt
                tittel={<TekstBlock block={omBarnaTekster.fosterbarn.sporsmal} />}
                søknadsvar={søknad.erNoenAvBarnaFosterbarn.svar}
            />
            {søknad.erNoenAvBarnaFosterbarn.svar === ESvar.JA && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={omBarnaTekster.hvemFosterbarn.sporsmal} />}
                    søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erFosterbarn)}
                />
            )}
            <OppsummeringFelt
                tittel={<TekstBlock block={omBarnaTekster.institusjonKontantstoette.sporsmal} />}
                søknadsvar={søknad.oppholderBarnSegIInstitusjon.svar}
            />

            {søknad.oppholderBarnSegIInstitusjon.svar === ESvar.JA && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={omBarnaTekster.hvemInstitusjon.sporsmal} />}
                    søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.oppholderSegIInstitusjon)}
                />
            )}
            <OppsummeringFelt
                tittel={<TekstBlock block={omBarnaTekster.adoptertKontantstoette.sporsmal} />}
                søknadsvar={søknad.erBarnAdoptert.svar}
            />
            {søknad.erBarnAdoptert.svar === ESvar.JA && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock block={omBarnaTekster.hvemAdoptertKontantstoette.sporsmal} />
                    }
                    søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erAdoptert)}
                />
            )}
            <OppsummeringFelt
                tittel={<TekstBlock block={omBarnaTekster.asyl.sporsmal} />}
                søknadsvar={søknad.søktAsylForBarn.svar}
            />
            {søknad.søktAsylForBarn.svar === ESvar.JA && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={omBarnaTekster.hvemAsyl.sporsmal} />}
                    søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erAsylsøker)}
                />
            )}
            <OppsummeringFelt
                tittel={<TekstBlock block={omBarnaTekster.sammenhengendeOppholdINorge.sporsmal} />}
                søknadsvar={søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar}
            />

            {søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar === ESvar.NEI && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={omBarnaTekster.hvemOppholdUtenforNorge.sporsmal} />}
                    søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.boddMindreEnn12MndINorge)}
                />
            )}
            <OppsummeringFelt
                tittel={<TekstBlock block={omBarnaTekster.soektYtelseEuEoes.sporsmal} />}
                søknadsvar={søknad.mottarKontantstøtteForBarnFraAnnetEøsland.svar}
            />

            {søknad.mottarKontantstøtteForBarnFraAnnetEøsland.svar === ESvar.JA && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={omBarnaTekster.hvemSoektYtelse.sporsmal} />}
                    søknadsvar={genererListeMedBarn(
                        barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland
                    )}
                />
            )}

            <OppsummeringFelt
                tittel={<TekstBlock block={omBarnaTekster.barnehageplass.sporsmal} />}
                søknadsvar={søknad.harEllerTildeltBarnehageplass.svar}
            />

            {søknad.harEllerTildeltBarnehageplass.svar === ESvar.JA && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={omBarnaTekster.hvemBarnehageplass.sporsmal} />}
                    søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.harBarnehageplass)}
                />
            )}
            {søknad.erAvdødPartnerForelder.svar && (
                <>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={
                                    søknad.erAvdødPartnerForelder.id ===
                                    OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                                        ? omBarnaTekster.folkeregistrertGjenlevende.sporsmal
                                        : omBarnaTekster.folkeregistrertEnkeEnkemann.sporsmal
                                }
                            />
                        }
                        søknadsvar={søknad.erAvdødPartnerForelder.svar}
                    />

                    {søknad.erAvdødPartnerForelder.svar === ESvar.JA && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock
                                    block={
                                        søknad.erAvdødPartnerForelder.id ===
                                        OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                                            ? omBarnaTekster.hvemAvBarnaAvdoedPartner.sporsmal
                                            : omBarnaTekster.hvemAvBarnaAvdoedEktefelle.sporsmal
                                    }
                                />
                            }
                            søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.andreForelderErDød)}
                        />
                    )}
                </>
            )}
        </Oppsummeringsbolk>
    );
};

export default OmBarnaOppsummering;
