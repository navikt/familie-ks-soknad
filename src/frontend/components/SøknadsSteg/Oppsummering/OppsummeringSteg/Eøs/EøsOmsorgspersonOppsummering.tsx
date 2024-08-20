import React from 'react';

import { useApp } from '../../../../../context/AppContext';
import { useSpråk } from '../../../../../context/SpråkContext';
import { IBarnMedISøknad } from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { IOmsorgsperson } from '../../../../../typer/omsorgsperson';
import { PersonType } from '../../../../../typer/personType';
import { hentSlektsforhold, landkodeTilSpråk } from '../../../../../utils/språk';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { KontantstøttePeriodeOppsummering } from '../../../../Felleskomponenter/KontantstøttePeriode/KontantstøttePeriodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import TekstBlock from '../../../../Felleskomponenter/TekstBlock';
import { UtbetalingsperiodeOppsummering } from '../../../../Felleskomponenter/UtbetalingerModal/UtbetalingsperiodeOppsummering';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';

const EøsOmsorgspersonOppsummering: React.FC<{
    omsorgsperson: IOmsorgsperson;
    barn: IBarnMedISøknad;
}> = ({ omsorgsperson, barn }) => {
    const { tekster, plainTekst } = useApp();
    const eøsBarnTekster = tekster().EØS_FOR_BARN;

    const { valgtLocale } = useSpråk();

    const flettefelter = { barnetsNavn: barn.navn };
    return (
        <StyledOppsummeringsFeltGruppe>
            {omsorgsperson.navn.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={eøsBarnTekster.hvaHeterOmsorgspersonen.sporsmal} />}
                    søknadsvar={omsorgsperson.navn.svar}
                />
            )}

            {omsorgsperson.slektsforhold.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.slektsforhold.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={plainTekst(
                        hentSlektsforhold(omsorgsperson.slektsforhold.svar, eøsBarnTekster)
                    )}
                />
            )}

            {omsorgsperson.slektsforholdSpesifisering.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.hvilkenRelasjonOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={omsorgsperson.slektsforholdSpesifisering.svar}
                />
            )}

            {omsorgsperson.idNummer.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={eøsBarnTekster.idNummerOmsorgsperson.sporsmal} />}
                    søknadsvar={
                        omsorgsperson.idNummer.svar === AlternativtSvarForInput.UKJENT
                            ? plainTekst(eøsBarnTekster.idNummerOmsorgsperson.checkboxLabel)
                            : omsorgsperson.idNummer.svar
                    }
                />
            )}

            {omsorgsperson.adresse.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={eøsBarnTekster.hvorBorOmsorgsperson.sporsmal} />}
                    søknadsvar={
                        omsorgsperson.adresse.svar === AlternativtSvarForInput.UKJENT
                            ? plainTekst(eøsBarnTekster.hvorBorOmsorgsperson.checkboxLabel)
                            : omsorgsperson.adresse.svar
                    }
                />
            )}

            {omsorgsperson.arbeidUtland.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.arbeidUtenforNorgeOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={omsorgsperson.arbeidUtland.svar}
                />
            )}
            {omsorgsperson.arbeidsperioderUtland.map((arbeidsperiode, index) => (
                <ArbeidsperiodeOppsummering
                    key={`arbeidsperiode-omsorgsperson-utland-${index}`}
                    arbeidsperiode={arbeidsperiode}
                    nummer={index + 1}
                    personType={PersonType.omsorgsperson}
                    gjelderUtlandet={true}
                    barn={barn}
                />
            ))}
            {omsorgsperson.arbeidNorge.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.arbeidNorgeOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={omsorgsperson.arbeidNorge.svar}
                />
            )}
            {omsorgsperson.arbeidsperioderNorge.map((arbeidsperiode, index) => (
                <ArbeidsperiodeOppsummering
                    key={`arbeidsperiode-omsorgsperson-norge-${index}`}
                    arbeidsperiode={arbeidsperiode}
                    nummer={index + 1}
                    personType={PersonType.omsorgsperson}
                    gjelderUtlandet={false}
                    barn={barn}
                />
            ))}
            {omsorgsperson.pensjonUtland.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.pensjonUtlandOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={omsorgsperson.pensjonUtland.svar}
                />
            )}
            {omsorgsperson.pensjonsperioderUtland.map((pensjonsperiode, index) => (
                <PensjonsperiodeOppsummering
                    key={`pensjonsperiode-omsorgsperson-utland-${index}`}
                    pensjonsperiode={pensjonsperiode}
                    nummer={index + 1}
                    personType={PersonType.omsorgsperson}
                    gjelderUtlandet={true}
                    barn={barn}
                />
            ))}
            {omsorgsperson.pensjonNorge.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.pensjonNorgeOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={omsorgsperson.pensjonNorge.svar}
                />
            )}
            {omsorgsperson.pensjonsperioderNorge.map((pensjonsperiode, index) => (
                <PensjonsperiodeOppsummering
                    key={`pensjonsperiode-omsorgsperson-norge-${index}`}
                    pensjonsperiode={pensjonsperiode}
                    nummer={index + 1}
                    personType={PersonType.omsorgsperson}
                    gjelderUtlandet={false}
                    barn={barn}
                />
            ))}
            {omsorgsperson.andreUtbetalinger.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.utbetalingerOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={omsorgsperson.andreUtbetalinger.svar}
                />
            )}
            {omsorgsperson.andreUtbetalingsperioder.map((utbetalingsperiode, index) => (
                <UtbetalingsperiodeOppsummering
                    key={`utbetalingsperiode-omsorgsperson-${index}`}
                    utbetalingsperiode={utbetalingsperiode}
                    nummer={index + 1}
                    personType={PersonType.omsorgsperson}
                    barn={barn}
                />
            ))}
            {omsorgsperson.pågåendeSøknadFraAnnetEøsLand.svar && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={eøsBarnTekster.paagaaendeSoeknadYtelseOmsorgsperson.sporsmal}
                                flettefelter={flettefelter}
                            />
                        }
                        søknadsvar={omsorgsperson.pågåendeSøknadFraAnnetEøsLand.svar}
                    />
                    {omsorgsperson.pågåendeSøknadHvilketLand.svar && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock
                                    block={
                                        eøsBarnTekster.hvilketLandSoektYtelseOmsorgsperson.sporsmal
                                    }
                                    flettefelter={flettefelter}
                                />
                            }
                            søknadsvar={landkodeTilSpråk(
                                omsorgsperson.pågåendeSøknadHvilketLand.svar,
                                valgtLocale
                            )}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            )}
            {omsorgsperson.kontantstøtteFraEøs.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={eøsBarnTekster.ytelseFraAnnetLandOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={omsorgsperson.kontantstøtteFraEøs.svar}
                />
            )}
            {omsorgsperson.eøsKontantstøttePerioder.map((periode, index) => (
                <KontantstøttePeriodeOppsummering
                    key={`kontantstøtte-periode-omsorgsperson-${index}`}
                    nummer={index + 1}
                    kontantstøttePeriode={periode}
                    barnetsNavn={barn.navn}
                    personType={PersonType.omsorgsperson}
                />
            ))}
        </StyledOppsummeringsFeltGruppe>
    );
};

export default EøsOmsorgspersonOppsummering;
