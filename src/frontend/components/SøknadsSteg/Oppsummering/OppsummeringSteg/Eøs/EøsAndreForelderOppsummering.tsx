import React, { Dispatch, SetStateAction } from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { PersonType } from '../../../../../typer/personType';
import { IEøsForBarnFeltTyper } from '../../../../../typer/skjema';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { BarnetrygdsperiodeOppsummering } from '../../../../Felleskomponenter/Barnetrygdperiode/BarnetrygdperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtbetalingsperiodeOppsummering } from '../../../../Felleskomponenter/UtbetalingerModal/UtbetalingsperiodeOppsummering';
import IdNummerForAndreForelder from '../../../EøsSteg/Barn/IdNummerForAndreForelder';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../../EøsSteg/Barn/spørsmål';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';

const EøsAndreForelderOppsummering: React.FC<{
    barn: IBarnMedISøknad;
    andreForelder: IAndreForelder;
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
}> = ({ barn, andreForelder, skjema, settIdNummerFelter }) => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const [valgtLocale] = useSprakContext();

    const andreForelderErDød = barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA;

    const jaNeiSpmOppsummering = (andreForelderDataKeySpm: andreForelderDataKeySpørsmål) =>
        barn.andreForelder && barn.andreForelder[andreForelderDataKeySpm].svar ? (
            <OppsummeringFelt
                tittel={
                    <SpråkTekst
                        id={eøsBarnSpørsmålSpråkId[barn.andreForelder[andreForelderDataKeySpm].id]}
                        values={{ barn: barn.navn }}
                    />
                }
                søknadsvar={barn.andreForelder[andreForelderDataKeySpm].svar}
            />
        ) : null;

    return (
        <>
            <IdNummerForAndreForelder
                skjema={skjema}
                barn={barn}
                settIdNummerFelter={settIdNummerFelter}
                lesevisning={true}
            />
            {andreForelder.adresse.svar && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={eøsBarnSpørsmålSpråkId[andreForelder.adresse.id]}
                                values={{ barn: barn.navn }}
                            />
                        }
                        søknadsvar={
                            andreForelder.adresse.svar === AlternativtSvarForInput.UKJENT
                                ? formatMessage({
                                      id: eøsBarnSpørsmålSpråkId[
                                          EøsBarnSpørsmålId.andreForelderAdresseVetIkke
                                      ],
                                  })
                                : andreForelder.adresse.svar
                        }
                    />
                </StyledOppsummeringsFeltGruppe>
            )}
            <StyledOppsummeringsFeltGruppe>
                {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.arbeidNorge)}
                {andreForelder.arbeidsperioderNorge.map((arbeidsperiode, index) => (
                    <ArbeidsperiodeOppsummering
                        key={`arbeidsperiode-andre-forelder-norge-${index}`}
                        arbeidsperiode={arbeidsperiode}
                        nummer={index + 1}
                        personType={PersonType.AndreForelder}
                        erDød={andreForelderErDød}
                        gjelderUtlandet={false}
                    />
                ))}
                {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.pensjonNorge)}
                {andreForelder.pensjonsperioderNorge.map((pensjonsperiode, index) => (
                    <PensjonsperiodeOppsummering
                        key={`pensjonsperiode-andre-forelder-norge-${index}`}
                        pensjonsperiode={pensjonsperiode}
                        nummer={index + 1}
                        personType={PersonType.AndreForelder}
                        erDød={andreForelderErDød}
                        barn={barn}
                        gjelderUtlandet={false}
                    />
                ))}
                {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.andreUtbetalinger)}
                {andreForelder.andreUtbetalingsperioder.map((utbetalingsperiode, index) => (
                    <UtbetalingsperiodeOppsummering
                        key={`utbetalingsperiode-andre-forelder-${index}`}
                        utbetalingsperiode={utbetalingsperiode}
                        nummer={index + 1}
                        personType={PersonType.AndreForelder}
                        erDød={andreForelderErDød}
                        barn={barn}
                    />
                ))}

                {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand)}
                {andreForelder.pågåendeSøknadHvilketLand.svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    eøsBarnSpørsmålSpråkId[
                                        andreForelder.pågåendeSøknadHvilketLand.id
                                    ]
                                }
                                values={{ barn: barn.navn }}
                            />
                        }
                        søknadsvar={landkodeTilSpråk(
                            andreForelder.pågåendeSøknadHvilketLand.svar,
                            valgtLocale
                        )}
                    />
                )}

                {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.barnetrygdFraEøs)}
                {andreForelder.eøsBarnetrygdsperioder.map((periode, index) => (
                    <BarnetrygdsperiodeOppsummering
                        key={`barnetrygdperiode-andre-forelder-${index}`}
                        nummer={index + 1}
                        barnetrygdsperiode={periode}
                        barnetsNavn={barn.navn}
                        personType={PersonType.AndreForelder}
                        erDød={andreForelderErDød}
                    />
                ))}
            </StyledOppsummeringsFeltGruppe>
        </>
    );
};

export default EøsAndreForelderOppsummering;
