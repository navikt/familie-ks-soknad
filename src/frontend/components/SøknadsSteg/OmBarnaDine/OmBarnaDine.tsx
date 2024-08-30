import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Alert } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { Typografi } from '../../../typer/common';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { VedleggOppsummering } from '../../Felleskomponenter/VedleggOppsummering';

import HvilkeBarnCheckboxGruppe from './HvilkeBarnCheckboxGruppe';
import { IOmBarnaTekstinnhold } from './innholdTyper';
import { OmBarnaDineSpørsmålId } from './spørsmål';
import { useOmBarnaDine } from './useOmBarnaDine';

const OmBarnaDine: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } =
        useOmBarnaDine();

    const navigate = useNavigate();
    const { søknad, tekster } = useApp();

    const { barnInkludertISøknaden } = søknad;

    const teksterForSteg: IOmBarnaTekstinnhold = tekster()[ESanitySteg.OM_BARNA];
    const {
        omBarnaTittel,
        omBarnaGuide,
        hvemBarnehageplass,
        fosterbarn,
        institusjonKontantstoette,
        adoptertKontantstoette,
        asyl,
        sammenhengendeOppholdINorge,
        soektYtelseEuEoes,
        barnehageplass,
        folkeregistrertEnkeEnkemann,
        folkeregistrertGjenlevende,
        hvemFosterbarn,
        hvemAdoptertKontantstoette,
        hvemAsyl,
        hvemAvBarnaAvdoedEktefelle,
        hvemAvBarnaAvdoedPartner,
        hvemInstitusjon,
        hvemOppholdUtenforNorge,
        hvemSoektYtelse,
    } = teksterForSteg;

    if (!barnInkludertISøknaden.length) {
        navigate('/velg-barn');
        return null;
    }
    return (
        <Steg
            tittel={<TekstBlock block={omBarnaTittel} />}
            guide={<TekstBlock block={omBarnaGuide} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erNoenAvBarnaFosterbarn}
                    spørsmålDokument={fosterbarn}
                />
                <HvilkeBarnCheckboxGruppe
                    legend={<TekstBlock block={hvemFosterbarn.sporsmal} />}
                    skjemafelt={skjema.felter.hvemErFosterbarn}
                    søknadsdatafelt={barnDataKeySpørsmål.erFosterbarn}
                    nullstillValgteBarn={skjema.felter.erNoenAvBarnaFosterbarn.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                {skjema.felter.erNoenAvBarnaFosterbarn.verdi === ESvar.JA && (
                    <Alert variant={'warning'} inline>
                        <TekstBlock block={fosterbarn.alert} typografi={Typografi.BodyShort} />
                    </Alert>
                )}

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderBarnSegIInstitusjon}
                    spørsmålDokument={institusjonKontantstoette}
                />
                <HvilkeBarnCheckboxGruppe
                    legend={<TekstBlock block={hvemInstitusjon.sporsmal} />}
                    skjemafelt={skjema.felter.hvemOppholderSegIInstitusjon}
                    søknadsdatafelt={barnDataKeySpørsmål.oppholderSegIInstitusjon}
                    nullstillValgteBarn={
                        skjema.felter.oppholderBarnSegIInstitusjon.verdi === ESvar.NEI
                    }
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                {skjema.felter.oppholderBarnSegIInstitusjon.verdi === ESvar.JA && (
                    <Alert variant={'warning'} inline>
                        <TekstBlock
                            block={institusjonKontantstoette.alert}
                            typografi={Typografi.BodyShort}
                        />
                    </Alert>
                )}

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erBarnAdoptert}
                    spørsmålDokument={adoptertKontantstoette}
                />
                <HvilkeBarnCheckboxGruppe
                    legend={<TekstBlock block={hvemAdoptertKontantstoette.sporsmal} />}
                    skjemafelt={skjema.felter.hvemErAdoptert}
                    søknadsdatafelt={barnDataKeySpørsmål.erAdoptert}
                    nullstillValgteBarn={skjema.felter.erBarnAdoptert.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.søktAsylForBarn}
                    spørsmålDokument={asyl}
                />
                <HvilkeBarnCheckboxGruppe
                    legend={<TekstBlock block={hvemAsyl.sporsmal} />}
                    skjemafelt={skjema.felter.hvemErSøktAsylFor}
                    søknadsdatafelt={barnDataKeySpørsmål.erAsylsøker}
                    nullstillValgteBarn={skjema.felter.søktAsylForBarn.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge}
                    spørsmålDokument={sammenhengendeOppholdINorge}
                    tilleggsinfo={
                        <TekstBlock
                            block={sammenhengendeOppholdINorge.alert}
                            typografi={Typografi.BodyShort}
                        />
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={<TekstBlock block={hvemOppholdUtenforNorge.sporsmal} />}
                    skjemafelt={skjema.felter.hvemTolvMndSammenhengendeINorge}
                    søknadsdatafelt={barnDataKeySpørsmål.boddMindreEnn12MndINorge}
                    nullstillValgteBarn={
                        skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge.verdi === ESvar.JA
                    }
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarKontantstøtteForBarnFraAnnetEøsland}
                    spørsmålDokument={soektYtelseEuEoes}
                />
                <HvilkeBarnCheckboxGruppe
                    legend={<TekstBlock block={hvemSoektYtelse.sporsmal} />}
                    skjemafelt={skjema.felter.hvemKontantstøtteFraAnnetEøsland}
                    søknadsdatafelt={barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland}
                    nullstillValgteBarn={
                        skjema.felter.mottarKontantstøtteForBarnFraAnnetEøsland.verdi === ESvar.NEI
                    }
                    visFeilmelding={skjema.visFeilmeldinger}
                ></HvilkeBarnCheckboxGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.harEllerTildeltBarnehageplass}
                    spørsmålDokument={barnehageplass}
                />
                <HvilkeBarnCheckboxGruppe
                    legend={<TekstBlock block={hvemBarnehageplass.sporsmal} />}
                    skjemafelt={skjema.felter.hvemHarBarnehageplass}
                    søknadsdatafelt={barnDataKeySpørsmål.harBarnehageplass}
                    nullstillValgteBarn={
                        skjema.felter.harEllerTildeltBarnehageplass.verdi === ESvar.NEI
                    }
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erAvdødPartnerForelder}
                    spørsmålDokument={
                        søknad.erAvdødPartnerForelder.id ===
                        OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                            ? folkeregistrertGjenlevende
                            : folkeregistrertEnkeEnkemann
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <TekstBlock
                            block={
                                søknad.erAvdødPartnerForelder.id ===
                                OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                                    ? hvemAvBarnaAvdoedPartner.sporsmal
                                    : hvemAvBarnaAvdoedEktefelle.sporsmal
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemAvdødPartner}
                    søknadsdatafelt={barnDataKeySpørsmål.andreForelderErDød}
                    nullstillValgteBarn={skjema.felter.erAvdødPartnerForelder.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>

            <VedleggOppsummering
                vedlegg={[
                    {
                        skalVises: skjema.felter.søktAsylForBarn.verdi === ESvar.JA,
                        dokumentasjonsbehov: Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE,
                    },
                    {
                        skalVises: skjema.felter.hvemHarBarnehageplass.erSynlig,
                        dokumentasjonsbehov: Dokumentasjonsbehov.BEKREFTELESE_PÅ_BARNEHAGEPLASS,
                    },
                ]}
            />
        </Steg>
    );
};

export default OmBarnaDine;
