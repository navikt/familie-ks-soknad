import React from 'react';

import { useApp } from '../../../../../context/AppContext';
import { useSteg } from '../../../../../context/StegContext';
import { IBarnMedISøknad } from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { hentSlektsforhold } from '../../../../../utils/språk';
import TekstBlock from '../../../../Felleskomponenter/TekstBlock';
import SamletIdNummerForBarn from '../../../EøsSteg/Barn/SamletIdNummerForBarn';
import { useEøsForBarn } from '../../../EøsSteg/Barn/useEøsForBarn';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';

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
                <>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={eøsBarnTekster.slektsforhold.sporsmal}
                                flettefelter={flettefelter}
                            />
                        }
                        søknadsvar={plainTekst(
                            hentSlektsforhold(barn.søkersSlektsforhold.svar, eøsBarnTekster)
                        )}
                    />
                    {barn.søkersSlektsforholdSpesifisering.svar && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock
                                    block={eøsBarnTekster.hvilkenRelasjon.sporsmal}
                                    flettefelter={flettefelter}
                                />
                            }
                            søknadsvar={barn.søkersSlektsforholdSpesifisering.svar}
                        />
                    )}
                </>
            )}

            {barn.borMedAndreForelder.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.borMedAndreForelder.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={barn.borMedAndreForelder.svar}
                />
            )}
            {barn.borMedOmsorgsperson.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.borMedOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={barn.borMedOmsorgsperson.svar}
                />
            )}

            {barn.omsorgsperson && (
                <EøsOmsorgspersonOppsummering omsorgsperson={barn.omsorgsperson} barn={barn} />
            )}

            {barn.adresse.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.hvorBorBarnet.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={
                        barn.adresse.svar === AlternativtSvarForInput.UKJENT
                            ? plainTekst(eøsBarnTekster.hvorBorBarnet.checkboxLabel)
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
