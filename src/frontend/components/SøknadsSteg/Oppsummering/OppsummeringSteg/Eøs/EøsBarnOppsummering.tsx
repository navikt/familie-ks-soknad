import React from 'react';

import { useIntl } from 'react-intl';

import { useSteg } from '../../../../../context/StegContext';
import { IBarnMedISøknad } from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { toSlektsforholdSpråkId } from '../../../../../utils/språk';
import SamletIdNummerForBarn from '../../../EøsSteg/Barn/SamletIdNummerForBarn';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../../EøsSteg/Barn/spørsmål';
import { useEøsForBarn } from '../../../EøsSteg/Barn/useEøsForBarn';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';
import EøsAndreForelderOppsummering from './EøsAndreForelderOppsummering';
import EøsOmsorgspersonOppsummering from './EøsOmsorgspersonOppsummering';
import { tittelSpmEøsBarnOppsummering } from './utils';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    barn: IBarnMedISøknad;
    nummer: string;
}

const EøsBarnOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn }) => {
    const { hentStegObjektForBarnEøs } = useSteg();

    const eøsForBarnHook = useEøsForBarn(barn.id);

    const { formatMessage } = useIntl();

    return (
        <Oppsummeringsbolk
            tittel={'eøs-om-barn.oppsummering.tittel'}
            språkValues={{ nummer, barn: barn.navn }}
            steg={hentStegObjektForBarnEøs(barn)}
            skjemaHook={eøsForBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            <SamletIdNummerForBarn
                barn={barn}
                settIdNummerFelter={eøsForBarnHook.settIdNummerFelterForBarn}
                skjema={eøsForBarnHook.skjema}
                lesevisning={true}
            />
            {barn.søkersSlektsforhold.svar && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={tittelSpmEøsBarnOppsummering(
                            barn.søkersSlektsforhold.id,
                            barn.navn
                        )}
                        søknadsvar={formatMessage({
                            id: toSlektsforholdSpråkId(barn.søkersSlektsforhold.svar),
                        })}
                    />
                    {barn.søkersSlektsforholdSpesifisering.svar && (
                        <OppsummeringFelt
                            tittel={tittelSpmEøsBarnOppsummering(
                                barn.søkersSlektsforholdSpesifisering.id,
                                barn.navn
                            )}
                            søknadsvar={barn.søkersSlektsforholdSpesifisering.svar}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            )}

            {barn.borMedAndreForelder.svar && (
                <OppsummeringFelt
                    tittel={tittelSpmEøsBarnOppsummering(barn.borMedAndreForelder.id, barn.navn)}
                    søknadsvar={barn.borMedAndreForelder.svar}
                />
            )}
            {barn.borMedOmsorgsperson.svar && (
                <OppsummeringFelt
                    tittel={tittelSpmEøsBarnOppsummering(barn.borMedOmsorgsperson.id, barn.navn)}
                    søknadsvar={barn.borMedOmsorgsperson.svar}
                />
            )}

            {barn.omsorgsperson && (
                <EøsOmsorgspersonOppsummering omsorgsperson={barn.omsorgsperson} barn={barn} />
            )}

            {barn.adresse.svar && (
                <OppsummeringFelt
                    tittel={tittelSpmEøsBarnOppsummering(barn.adresse.id, barn.navn)}
                    søknadsvar={
                        barn.adresse.svar === AlternativtSvarForInput.UKJENT
                            ? formatMessage({
                                  id: eøsBarnSpørsmålSpråkId[
                                      EøsBarnSpørsmålId.barnetsAdresseVetIkke
                                  ],
                              })
                            : barn.adresse.svar
                    }
                />
            )}

            {barn.andreForelder && (
                <EøsAndreForelderOppsummering
                    barn={barn}
                    andreForelder={barn.andreForelder}
                    skjema={eøsForBarnHook.skjema}
                    settIdNummerFelter={eøsForBarnHook.settIdNummerFelterForAndreForelder}
                />
            )}
        </Oppsummeringsbolk>
    );
};

export default EøsBarnOppsummering;
