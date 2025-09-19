import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../../../context/AppContext';
import { useSpråkContext } from '../../../../../context/SpråkContext';
import { useStegContext } from '../../../../../context/StegContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../../../typer/barn';
import { FlettefeltVerdier } from '../../../../../typer/kontrakt/generelle';
import { PersonType } from '../../../../../typer/personType';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { BarnehageplassPeriodeOppsummering } from '../../../../Felleskomponenter/Barnehagemodal/BarnehageplassPeriodeOppsummering';
import { KontantstøttePeriodeOppsummering } from '../../../../Felleskomponenter/KontantstøttePeriode/KontantstøttePeriodeOppsummering';
import TekstBlock from '../../../../Felleskomponenter/TekstBlock';
import { UtenlandsperiodeOppsummering } from '../../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { useOmBarnet } from '../../../OmBarnet/useOmBarnet';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';

import AndreForelderOppsummering from './AndreForelderOppsummering';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    barn: IBarnMedISøknad;
    index: number;
}

const OmBarnetOppsummering: React.FC<Props> = ({ settFeilAnchors, barn, index }) => {
    const { hentStegObjektForBarn } = useStegContext();
    const { tekster, plainTekst } = useAppContext();
    const omBarnetTekster = tekster().OM_BARNET;
    const { valgtLocale } = useSpråkContext();
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
            {barn[barnDataKeySpørsmål.utbetaltForeldrepengerEllerEngangsstønad].svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={omBarnetTekster.utbetaltForeldrepengerEllerEngangsstoenad.sporsmal} />}
                    søknadsvar={barn.utbetaltForeldrepengerEllerEngangsstønad.svar}
                />
            )}

            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={omBarnetTekster.opplystBarnOppholdUtenforNorge}
                                flettefelter={flettefelter}
                            />
                        }
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
                            tittel={
                                <TekstBlock
                                    block={omBarnetTekster.planlagtBoSammenhengendeINorge.sporsmal}
                                    flettefelter={flettefelter}
                                />
                            }
                            søknadsvar={barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar}
                        />
                    )}
                </>
            )}

            {barn[barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland].svar === ESvar.JA && (
                <>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={omBarnetTekster.opplystFaarHarFaattEllerSoektYtelse}
                                flettefelter={flettefelter}
                            />
                        }
                    />
                    {barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand].svar && (
                        <OppsummeringFelt
                            tittel={<TekstBlock block={omBarnetTekster.paagaaendeSoeknadYtelse.sporsmal} />}
                            søknadsvar={barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand].svar}
                        />
                    )}
                    {barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar && (
                        <OppsummeringFelt
                            tittel={<TekstBlock block={omBarnetTekster.hvilketLandYtelse.sporsmal} />}
                            søknadsvar={landkodeTilSpråk(
                                barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar,
                                valgtLocale
                            )}
                        />
                    )}
                    {barn[barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte].svar && (
                        <OppsummeringFelt
                            tittel={<TekstBlock block={omBarnetTekster.faarEllerHarFaattYtelseFraAnnetLand.sporsmal} />}
                            søknadsvar={barn[barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte].svar}
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
                </>
            )}
            {barn[barnDataKeySpørsmål.harBarnehageplass].svar === ESvar.JA && (
                <>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock block={omBarnetTekster.opplystBarnehageplass} flettefelter={flettefelter} />
                        }
                    />
                    {barn.barnehageplassPerioder.map((periode, index) => (
                        <BarnehageplassPeriodeOppsummering
                            key={`barnehageplass-periode-${index}`}
                            barnehageplassPeriode={periode}
                            nummer={index + 1}
                        />
                    ))}
                </>
            )}

            {barn.andreForelder && (
                <OppsummeringFelt tittel={plainTekst(omBarnetTekster.barnetsAndreForelder)}>
                    <AndreForelderOppsummering andreForelder={barn.andreForelder} barn={barn} />
                </OppsummeringFelt>
            )}

            <OppsummeringFelt
                tittel={
                    <TekstBlock block={omBarnetTekster.borBarnFastSammenMedDeg.sporsmal} flettefelter={flettefelter} />
                }
                søknadsvar={barn[barnDataKeySpørsmål.borFastMedSøker].svar}
            />
            {barn[barnDataKeySpørsmål.foreldreBorSammen].svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock block={omBarnetTekster.borForeldreSammen.sporsmal} flettefelter={flettefelter} />
                    }
                    søknadsvar={barn[barnDataKeySpørsmål.foreldreBorSammen].svar}
                />
            )}
            {barn[barnDataKeySpørsmål.søkerDeltKontantstøtte].svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={omBarnetTekster.soekerDeltKontantstoette.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={barn[barnDataKeySpørsmål.søkerDeltKontantstøtte].svar}
                />
            )}
        </Oppsummeringsbolk>
    );
};

export default OmBarnetOppsummering;
