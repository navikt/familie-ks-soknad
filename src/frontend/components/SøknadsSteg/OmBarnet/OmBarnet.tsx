import React from 'react';

import { Alert } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import { BarnetsId, Typografi } from '../../../typer/common';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import AndreForelder from './AndreForelder';
import { IOmBarnetTekstinnhold } from './innholdTyper';
import { OmBarnetHeader } from './OmBarnetHeader';
import Oppfølgningsspørsmål from './Oppfølgningsspørsmål';
import { useOmBarnet } from './useOmBarnet';

const OmBarnet: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const { tekster, plainTekst } = useAppContext();
    const { erEøsTrigget } = useEøsContext();
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

    const teksterForSteg: IOmBarnetTekstinnhold = tekster()[ESanitySteg.OM_BARNET];

    const {
        omBarnetTittel,
        omBarnetGuide,
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

    return barn ? (
        <Steg
            tittel={<TekstBlock block={omBarnetTittel} flettefelter={{ barnetsNavn }} />}
            guide={<TekstBlock block={omBarnetGuide} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
            vedleggOppsummering={[
                {
                    skalVises: borFastMedSøker.verdi === ESvar.JA && !barn.borMedSøker,
                    dokumentasjonsbehov: Dokumentasjonsbehov.BOR_FAST_MED_SØKER,
                    flettefeltVerdier: { barnetsNavn },
                },
                {
                    skalVises:
                        søkerDeltKontantstøtte.erSynlig &&
                        søkerDeltKontantstøtte.verdi === ESvar.JA,
                    dokumentasjonsbehov: Dokumentasjonsbehov.AVTALE_DELT_BOSTED,
                },
            ]}
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
                <KomponentGruppe>
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
                </KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={foreldreBorSammen}
                    spørsmålDokument={borForeldreSammen}
                    flettefelter={{ barnetsNavn }}
                />
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
            </SkjemaFieldset>
        </Steg>
    ) : null;
};

export default OmBarnet;
