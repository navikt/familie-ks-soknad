import React from 'react';

import styled from 'styled-components';

import { Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { BarnetsId } from '../../../typer/common';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import AndreForelder from './AndreForelder';
import { OmBarnetHeader } from './OmBarnetHeader';
import Oppfølgningsspørsmål from './Oppfølgningsspørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';
import { useOmBarnet } from './useOmBarnet';

const EksternLenkeContainer = styled.div`
    margin-bottom: 4rem;
`;

const OmBarnet: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
        andreBarnSomErFyltUt,
        leggTilUtenlandsperiodeBarn,
        fjernUtenlandsperiodeBarn,
        utenlandsperioderBarn,
        leggTilUtenlandsperiodeAndreForelder,
        fjernUtenlandsperiodeAndreForelder,
        utenlandsperioderAndreForelder,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilKontantstøttePeriode,
        fjernKontantstøttePeriode,
        leggTilBarnehageplassPeriode,
        fjernBarnehageplassPeriode,
    } = useOmBarnet(barnetsId);

    return barn ? (
        <Steg
            tittel={<SpråkTekst id={'ombarnet.sidetittel'} values={{ navn: barn.navn }} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <OmBarnetHeader barn={barn} />
            <Oppfølgningsspørsmål
                barn={barn}
                skjema={skjema}
                leggTilUtenlandsperiode={leggTilUtenlandsperiodeBarn}
                fjernUtenlandsperiode={fjernUtenlandsperiodeBarn}
                utenlandsperioder={utenlandsperioderBarn}
                leggTilKontantstøttePeriode={leggTilKontantstøttePeriode}
                fjernKontantstøttePeriode={fjernKontantstøttePeriode}
                registrerteEøsKontantstøttePerioder={
                    skjema.felter.registrerteEøsKontantstøttePerioder
                }
                leggTilBarnehageplassPeriode={leggTilBarnehageplassPeriode}
                fjernBarnehageplassPeriode={fjernBarnehageplassPeriode}
                registrerteBarnehageplassPerioder={skjema.felter.registrerteBarnehageplassPerioder}
            />
            {barn.andreForelder && (
                <AndreForelder
                    barn={barn}
                    skjema={skjema}
                    andreBarnSomErFyltUt={andreBarnSomErFyltUt}
                    leggTilUtenlandsperiode={leggTilUtenlandsperiodeAndreForelder}
                    fjernUtenlandsperiode={fjernUtenlandsperiodeAndreForelder}
                    utenlandsperioder={utenlandsperioderAndreForelder}
                    leggTilArbeidsperiode={leggTilArbeidsperiode}
                    fjernArbeidsperiode={fjernArbeidsperiode}
                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                    fjernPensjonsperiode={fjernPensjonsperiode}
                />
            )}

            {skjema.felter.borFastMedSøker.erSynlig && (
                <SkjemaFieldset tittelId={'ombarnet.bosted'} dynamisk>
                    {barn.andreForelderErDød?.svar !== ESvar.JA && (
                        <>
                            <div>
                                <Normaltekst>
                                    <SpråkTekst id={'ombarnet.bosted-info'} />
                                </Normaltekst>
                            </div>
                            <EksternLenkeContainer>
                                <EksternLenke
                                    lenkeSpråkId={'ombarnet.les-mer-om-bosted.lenke'}
                                    lenkeTekstSpråkId={'ombarnet.les-mer-om-bosted.lenketekst'}
                                    target="_blank"
                                />
                            </EksternLenkeContainer>
                        </>
                    )}
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.borFastMedSøker}
                        spørsmålTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.borFastMedSøker]
                        }
                        språkValues={{ navn: barn.navn }}
                    />
                    {skjema.felter.borFastMedSøker.verdi === ESvar.JA && !barn.borMedSøker && (
                        <VedleggNotis språkTekstId={'ombarnet.bor-fast.vedleggsinfo'} dynamisk />
                    )}

                    {skjema.felter.skriftligAvtaleOmDeltBosted.erSynlig && (
                        <>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.skriftligAvtaleOmDeltBosted}
                                spørsmålTekstId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted
                                    ]
                                }
                                språkValues={{ navn: barn.navn }}
                            />
                            {skjema.felter.skriftligAvtaleOmDeltBosted.verdi === ESvar.JA && (
                                <VedleggNotis
                                    språkTekstId={'ombarnet.delt-bosted.vedleggsinfo'}
                                    dynamisk
                                />
                            )}
                        </>
                    )}
                </SkjemaFieldset>
            )}
        </Steg>
    ) : null;
};

export default OmBarnet;
