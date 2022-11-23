import React from 'react';

import { useIntl } from 'react-intl';

import { useApp } from '../../../../../context/AppContext';
import { useSteg } from '../../../../../context/StegContext';
import { IBarnMedISøknad } from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { hentSlektsforhold } from '../../../../../utils/språk';
import SamletIdNummerForBarn from '../../../EøsSteg/Barn/SamletIdNummerForBarn';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../../EøsSteg/Barn/spørsmål';
import { useEøsForBarn } from '../../../EøsSteg/Barn/useEøsForBarn';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';
import EøsAndreForelderOppsummering from './EøsAndreForelderOppsummering';
import EøsOmsorgspersonOppsummering from './EøsOmsorgspersonOppsummering';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    barn: IBarnMedISøknad;
}

const EøsBarnOppsummering: React.FC<Props> = ({ settFeilAnchors, barn }) => {
    const { hentStegObjektForBarnEøs } = useSteg();
    const { tekster, plainTekst } = useApp();
    const eøsBarnTekster = tekster().EØS_FOR_BARN;

    const eøsForBarnHook = useEøsForBarn(barn.id);

    const { formatMessage } = useIntl();

    const flettefelter = { barnetsNavn: barn.navn };
    return (
        <Oppsummeringsbolk
            tittel={eøsBarnTekster.eoesForBarnTittel}
            flettefelter={flettefelter}
            steg={hentStegObjektForBarnEøs(barn)}
            skjemaHook={eøsForBarnHook}
            settFeilAnchors={settFeilAnchors}
            barn={barn}
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
                        spørsmålstekst={eøsBarnTekster.slektsforhold.sporsmal}
                        flettefelter={flettefelter}
                        søknadsvar={plainTekst(
                            hentSlektsforhold(barn.søkersSlektsforhold.svar, eøsBarnTekster)
                        )}
                    />
                    {barn.søkersSlektsforholdSpesifisering.svar && (
                        <OppsummeringFelt
                            spørsmålstekst={eøsBarnTekster.hvilkenRelasjon.sporsmal}
                            flettefelter={flettefelter}
                            søknadsvar={barn.søkersSlektsforholdSpesifisering.svar}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            )}

            {barn.borMedAndreForelder.svar && (
                <OppsummeringFelt
                    spørsmålstekst={eøsBarnTekster.borMedAndreForelder.sporsmal}
                    flettefelter={flettefelter}
                    søknadsvar={barn.borMedAndreForelder.svar}
                />
            )}
            {barn.borMedOmsorgsperson.svar && (
                <OppsummeringFelt
                    spørsmålstekst={eøsBarnTekster.borMedOmsorgsperson.sporsmal}
                    flettefelter={flettefelter}
                    søknadsvar={barn.borMedOmsorgsperson.svar}
                />
            )}

            {barn.omsorgsperson && (
                <EøsOmsorgspersonOppsummering omsorgsperson={barn.omsorgsperson} barn={barn} />
            )}

            {barn.adresse.svar && (
                <OppsummeringFelt
                    spørsmålstekst={eøsBarnTekster.hvorBorBarnet.sporsmal}
                    flettefelter={flettefelter}
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
