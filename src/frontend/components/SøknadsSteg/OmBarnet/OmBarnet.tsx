import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { BarnetsId, Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
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
    const { erEøsTrigget } = useEøs();
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

    const {
        omBarnetTittel,
        bosted,
        borBarnFastSammenMedDeg,
        deltBosted,
        borForeldreSammen,
        soekerDeltKontantstoette,
    } = teksterForSteg;

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

            <SkjemaFieldset
                tittel={
                    <Heading size={'xsmall'} level={'2'} spacing>
                        {plainTekst(bosted)}
                    </Heading>
                }
                dynamisk
            >
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.borFastMedSøker}
                    spørsmålDokument={borBarnFastSammenMedDeg}
                    flettefelter={{ barnetsNavn }}
                />

                {skjema.felter.borFastMedSøker.verdi === ESvar.NEI && !erEøsTrigget() && (
                    <AlertStripe variant={'warning'}>
                        <TekstBlock block={borBarnFastSammenMedDeg.alert} />
                    </AlertStripe>
                )}

                {skjema.felter.borFastMedSøker.verdi === ESvar.JA && !barn.borMedSøker && (
                    <VedleggNotis dynamisk>
                        <BodyShort>{plainTekst(borBarnFastSammenMedDeg.vedleggsnotis)}</BodyShort>
                    </VedleggNotis>
                )}

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.foreldreBorSammen}
                    spørsmålDokument={borForeldreSammen}
                    flettefelter={{ barnetsNavn }}
                />

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.søkerDeltKontantstøtte}
                    spørsmålDokument={soekerDeltKontantstoette}
                    flettefelter={{ barnetsNavn }}
                />

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
                                <BodyShort>{plainTekst(deltBosted.vedleggsnotis)}</BodyShort>
                            </VedleggNotis>
                        )}
                    </>
                )}
            </SkjemaFieldset>
        </Steg>
    ) : null;
};

export default OmBarnet;
