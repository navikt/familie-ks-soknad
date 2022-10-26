import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { BarnetsId, Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import AndreForelder from './AndreForelder';
import { IOmBarnetTekstinnhold } from './innholdTyper';
import { OmBarnetHeader } from './OmBarnetHeader';
import Oppfølgningsspørsmål from './Oppfølgningsspørsmål';
import { useOmBarnet } from './useOmBarnet';

const OmBarnet: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const { tekster, plainTekst } = useApp();
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
        andreBarnSomErFyltUt,
        leggTilUtenlandsperiodeBarn,
        fjernUtenlandsperiodeBarn,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilKontantstøttePeriode,
        fjernKontantstøttePeriode,
        leggTilBarnehageplassPeriode,
        fjernBarnehageplassPeriode,
    } = useOmBarnet(barnetsId);

    const teksterForSteg: IOmBarnetTekstinnhold = tekster()[ESanitySteg.OM_BARNET];

    const { omBarnetTittel, fastBosted, bosted, borBarnFastSammenMedDeg, deltBosted } =
        teksterForSteg;

    const barnetsNavn = barn?.navn;

    return barn ? (
        <Steg
            tittel={
                <TekstBlock
                    block={omBarnetTittel}
                    flettefelter={{ barnetsNavn }}
                    typografi={Typografi.StegHeadingH1}
                />
            }
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
                    leggTilArbeidsperiode={leggTilArbeidsperiode}
                    fjernArbeidsperiode={fjernArbeidsperiode}
                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                    fjernPensjonsperiode={fjernPensjonsperiode}
                />
            )}

            {skjema.felter.borFastMedSøker.erSynlig && (
                <SkjemaFieldset
                    tittel={
                        <Heading size={'xsmall'} level={'2'} spacing>
                            {plainTekst(bosted)}
                        </Heading>
                    }
                    dynamisk
                >
                    {barn.andreForelderErDød?.svar !== ESvar.JA && (
                        <TekstBlock block={fastBosted} typografi={Typografi.BodyLong} />
                    )}
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.borFastMedSøker}
                        spørsmålDokument={borBarnFastSammenMedDeg}
                        flettefelter={{ barnetsNavn }}
                    />
                    {skjema.felter.borFastMedSøker.verdi === ESvar.JA && !barn.borMedSøker && (
                        <VedleggNotis dynamisk>
                            <BodyShort>
                                {plainTekst(borBarnFastSammenMedDeg.vedleggsnotis)}
                            </BodyShort>
                        </VedleggNotis>
                    )}

                    {skjema.felter.skriftligAvtaleOmDeltBosted.erSynlig && (
                        <>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.skriftligAvtaleOmDeltBosted}
                                spørsmålDokument={deltBosted}
                                flettefelter={{ barnetsNavn }}
                            />
                            {skjema.felter.skriftligAvtaleOmDeltBosted.verdi === ESvar.JA && (
                                <VedleggNotis dynamisk>
                                    <BodyShort>{deltBosted.vedleggsnotis}</BodyShort>
                                </VedleggNotis>
                            )}
                        </>
                    )}
                </SkjemaFieldset>
            )}
        </Steg>
    ) : null;
};

export default OmBarnet;
