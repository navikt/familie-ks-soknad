import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../../../context/AppContext';
import { useSteg } from '../../../../../context/StegContext';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
} from '../../../../../typer/barn';
import { FlettefeltVerdier } from '../../../../../typer/kontrakt/generelle';
import { PersonType } from '../../../../../typer/personType';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { BarnehageplassPeriodeOppsummering } from '../../../../Felleskomponenter/Barnehagemodal/BarnehageplassPeriodeOppsummering';
import { KontantstøttePeriodeOppsummering } from '../../../../Felleskomponenter/KontantstøttePeriode/KontantstøttePeriodeOppsummering';
import { UtenlandsperiodeOppsummering } from '../../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { useOmBarnet } from '../../../OmBarnet/useOmBarnet';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';
import AndreForelderOppsummering from './AndreForelderOppsummering';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    barn: IBarnMedISøknad;
    index: number;
}

const OmBarnetOppsummering: React.FC<Props> = ({ settFeilAnchors, barn, index }) => {
    const { hentStegObjektForBarn } = useSteg();
    const { tekster } = useApp();
    const omBarnetTekster = tekster().OM_BARNET;
    const [valgtLocale] = useSprakContext();
    const omBarnetHook = useOmBarnet(barn.id);

    const flettefelter: FlettefeltVerdier = { barnetsNavn: barn.navn };
    return (
        <Oppsummeringsbolk
            tittel={omBarnetTekster.omBarnetTittel}
            flettefelter={{ barnetsNavn: barn.navn }}
            key={index}
            steg={hentStegObjektForBarn(barn)}
            skjemaHook={omBarnetHook}
            settFeilAnchors={settFeilAnchors}
            barn={barn}
        >
            {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA && (
                <OppsummeringFelt
                    spørsmålstekst={omBarnetTekster.opplystFosterbarn}
                    flettefelter={flettefelter}
                />
            )}

            {barn[barnDataKeySpørsmål.utbetaltForeldrepengerEllerEngangsstønad].svar && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        spørsmålstekst={
                            omBarnetTekster.utbetaltForeldrepengerEllerEngangsstoenad.sporsmal
                        }
                        søknadsvar={barn.utbetaltForeldrepengerEllerEngangsstønad.svar}
                    />
                </StyledOppsummeringsFeltGruppe>
            )}

            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        spørsmålstekst={omBarnetTekster.opplystBarnOppholdUtenforNorge}
                        flettefelter={flettefelter}
                    />
                    {barn.utenlandsperioder.map((periode, index) => (
                        <UtenlandsperiodeOppsummering
                            key={index}
                            periode={periode}
                            nummer={index + 1}
                            personType={PersonType.barn}
                        />
                    ))}
                    {barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar && (
                        <OppsummeringFelt
                            spørsmålstekst={omBarnetTekster.planlagtBoSammenhengendeINorge.sporsmal}
                            flettefelter={flettefelter}
                            søknadsvar={barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            )}

            {barn[barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        spørsmålstekst={omBarnetTekster.opplystFaarHarFaattEllerSoektYtelse}
                        flettefelter={flettefelter}
                    />
                    {barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand].svar && (
                        <OppsummeringFelt
                            spørsmålstekst={omBarnetTekster.paagaaendeSoeknadYtelse.sporsmal}
                            søknadsvar={
                                barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand].svar
                            }
                        />
                    )}
                    {barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar && (
                        <OppsummeringFelt
                            spørsmålstekst={omBarnetTekster.hvilketLandYtelse.sporsmal}
                            søknadsvar={landkodeTilSpråk(
                                barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar,
                                valgtLocale
                            )}
                        />
                    )}
                    {barn[barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte].svar && (
                        <OppsummeringFelt
                            spørsmålstekst={
                                omBarnetTekster.faarEllerHarFaattYtelseFraAnnetLand.sporsmal
                            }
                            søknadsvar={
                                barn[barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte].svar
                            }
                        />
                    )}
                    {barn.eøsKontantstøttePerioder.map((periode, index) => (
                        <KontantstøttePeriodeOppsummering
                            key={`kontantstøtte-periode-søker-${index}`}
                            nummer={index + 1}
                            kontantstøttePeriode={periode}
                            barnetsNavn={barn.navn}
                            personType={PersonType.søker}
                        />
                    ))}
                </StyledOppsummeringsFeltGruppe>
            )}
            {barn[barnDataKeySpørsmål.harBarnehageplass].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    {barn.barnehageplassPerioder.map((periode, index) => (
                        <BarnehageplassPeriodeOppsummering
                            key={`barnehageplass-periode-${index}`}
                            barnehageplassPeriode={periode}
                            nummer={index + 1}
                        />
                    ))}
                </StyledOppsummeringsFeltGruppe>
            )}

            {barn.andreForelder && (
                <AndreForelderOppsummering andreForelder={barn.andreForelder} barn={barn} />
            )}
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt spørsmålstekst={omBarnetTekster.bosted} />

                <OppsummeringFelt
                    spørsmålstekst={omBarnetTekster.borBarnFastSammenMedDeg.sporsmal}
                    flettefelter={flettefelter}
                    søknadsvar={barn[barnDataKeySpørsmål.borFastMedSøker].svar}
                />
                {barn.andreForelder?.[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]
                    .svar && (
                    <OppsummeringFelt
                        spørsmålstekst={omBarnetTekster.deltBosted.sporsmal}
                        flettefelter={flettefelter}
                        søknadsvar={
                            barn.andreForelder[
                                andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted
                            ].svar
                        }
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default OmBarnetOppsummering;
