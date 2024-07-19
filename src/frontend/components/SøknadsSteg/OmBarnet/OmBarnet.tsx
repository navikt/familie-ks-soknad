import React from 'react';

import { Alert } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
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
        harPeriodeMedGradertBarnehageplass,
        leggTilUtenlandsperiodeAndreForelder,
        fjernUtenlandsperiodeAndreForelder,
    } = useOmBarnet(barnetsId);
    const { toggles } = useFeatureToggles();

    const teksterForSteg: IOmBarnetTekstinnhold = tekster()[ESanitySteg.OM_BARNET];

    const {
        omBarnetTittel,
        bosted,
        borBarnFastSammenMedDeg,
        borForeldreSammen,
        soekerDeltKontantstoette,
    } = teksterForSteg;

    const barnetsNavn = barn?.navn;

    const {
        registrerteEøsKontantstøttePerioder,
        registrerteBarnehageplassPerioder,
        borFastMedSøker,
        foreldreBorSammen,
        søkerDeltKontantstøtte,
    } = skjema.felter;

    const dokumentasjonTekster = tekster()[ESanitySteg.DOKUMENTASJON];
    const { bekreftelsePaaAtBarnBorSammenMedDeg, avtaleOmDeltBosted } = dokumentasjonTekster;

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
                registrerteEøsKontantstøttePerioder={registrerteEøsKontantstøttePerioder}
                leggTilBarnehageplassPeriode={leggTilBarnehageplassPeriode}
                fjernBarnehageplassPeriode={fjernBarnehageplassPeriode}
                registrerteBarnehageplassPerioder={registrerteBarnehageplassPerioder}
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
                    leggTilUtenlandsperiode={leggTilUtenlandsperiodeAndreForelder}
                    fjernUtenlandsperiode={fjernUtenlandsperiodeAndreForelder}
                />
            )}

            <SkjemaFieldset legend={plainTekst(bosted)} dynamisk>
                <JaNeiSpm
                    skjema={skjema}
                    felt={borFastMedSøker}
                    spørsmålDokument={borBarnFastSammenMedDeg}
                    flettefelter={{ barnetsNavn }}
                />

                {borFastMedSøker.verdi === ESvar.NEI && !erEøsTrigget() && (
                    <Alert variant={'warning'} inline>
                        <TekstBlock block={borBarnFastSammenMedDeg.alert} />
                    </Alert>
                )}

                {borFastMedSøker.verdi === ESvar.JA &&
                    !barn.borMedSøker &&
                    (toggles.NYE_VEDLEGGSTEKSTER ? (
                        <VedleggNotis
                            block={bekreftelsePaaAtBarnBorSammenMedDeg}
                            flettefelter={{ barnetsNavn }}
                            dynamisk
                        />
                    ) : (
                        borBarnFastSammenMedDeg.vedleggsnotis && (
                            <VedleggNotis block={borBarnFastSammenMedDeg.vedleggsnotis} dynamisk />
                        )
                    ))}

                <JaNeiSpm
                    skjema={skjema}
                    felt={foreldreBorSammen}
                    spørsmålDokument={borForeldreSammen}
                    flettefelter={{ barnetsNavn }}
                />

                <>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={søkerDeltKontantstøtte}
                        spørsmålDokument={soekerDeltKontantstoette}
                        flettefelter={{ barnetsNavn }}
                        tilleggsinfo={
                            harPeriodeMedGradertBarnehageplass ? (
                                <TekstBlock
                                    block={soekerDeltKontantstoette.alert}
                                    typografi={Typografi.BodyShort}
                                />
                            ) : undefined
                        }
                    />
                    {søkerDeltKontantstøtte.erSynlig &&
                        søkerDeltKontantstøtte.verdi === ESvar.JA &&
                        (toggles.NYE_VEDLEGGSTEKSTER ? (
                            <VedleggNotis
                                block={avtaleOmDeltBosted}
                                flettefelter={{ barnetsNavn }}
                                dynamisk
                            />
                        ) : (
                            soekerDeltKontantstoette.vedleggsnotis && (
                                <VedleggNotis
                                    block={soekerDeltKontantstoette.vedleggsnotis}
                                    dynamisk
                                />
                            )
                        ))}
                </>
            </SkjemaFieldset>
        </Steg>
    ) : null;
};

export default OmBarnet;
