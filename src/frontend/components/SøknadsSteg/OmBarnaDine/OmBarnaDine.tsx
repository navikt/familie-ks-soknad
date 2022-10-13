import React from 'react';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import HvilkeBarnCheckboxGruppe from './HvilkeBarnCheckboxGruppe';
import { OmBarnaDineSpørsmålId, omBarnaDineSpørsmålSpråkId } from './spørsmål';
import { useOmBarnaDine } from './useOmBarnaDine';

const VedleggNotisWrapper = styled.div`
    margin: -1.5rem 0 4.5rem 0;
`;

const OmBarnaDine: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } =
        useOmBarnaDine();

    const history = useHistory();
    const { søknad, tekster, plainTekst } = useApp();
    const { barnInkludertISøknaden } = søknad;

    const {
        [ESanitySteg.OM_BARNA]: { omBarnaTittel, hvemBarnehageplass },
    } = tekster();

    if (!barnInkludertISøknaden.length) {
        history.push('/velg-barn');
        return null;
    }
    return (
        <Steg
            tittel={<TekstBlock block={omBarnaTittel} typografi={Typografi.StegHeadingH1} />}
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
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legendSpråkId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.hvemErFosterbarn]
                    }
                    skjemafelt={skjema.felter.hvemErFosterbarn}
                    søknadsdatafelt={barnDataKeySpørsmål.erFosterbarn}
                    nullstillValgteBarn={skjema.felter.erNoenAvBarnaFosterbarn.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderBarnSegIInstitusjon}
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[
                            OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon
                        ]
                    }
                    tilleggsinfo={
                        <AlertStripe variant={'info'}>
                            <SpråkTekst id={'ombarna.institusjon.info'} />
                        </AlertStripe>
                    }
                />

                <HvilkeBarnCheckboxGruppe
                    legendSpråkId={
                        omBarnaDineSpørsmålSpråkId[
                            OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon
                        ]
                    }
                    skjemafelt={skjema.felter.hvemOppholderSegIInstitusjon}
                    søknadsdatafelt={barnDataKeySpørsmål.oppholderSegIInstitusjon}
                    nullstillValgteBarn={
                        skjema.felter.oppholderBarnSegIInstitusjon.verdi === ESvar.NEI
                    }
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erBarnAdoptertFraUtland}
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland]
                    }
                    tilleggsinfo={
                        <AlertStripe variant={'info'}>
                            <SpråkTekst id={'ombarna.adoptert.info'} />
                        </AlertStripe>
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legendSpråkId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland]
                    }
                    skjemafelt={skjema.felter.hvemErAdoptertFraUtland}
                    søknadsdatafelt={barnDataKeySpørsmål.erAdoptertFraUtland}
                    nullstillValgteBarn={skjema.felter.erBarnAdoptertFraUtland.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                {skjema.felter.erBarnAdoptertFraUtland.verdi === ESvar.JA && (
                    <VedleggNotisWrapper>
                        <VedleggNotis dynamisk språkTekstId={'ombarna.adoptert.alert'} />
                    </VedleggNotisWrapper>
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.søktAsylForBarn}
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.søktAsylForBarn]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legendSpråkId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.hvemErSøktAsylFor]
                    }
                    skjemafelt={skjema.felter.hvemErSøktAsylFor}
                    søknadsdatafelt={barnDataKeySpørsmål.erAsylsøker}
                    nullstillValgteBarn={skjema.felter.søktAsylForBarn.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                {skjema.felter.søktAsylForBarn.verdi === ESvar.JA && (
                    <VedleggNotisWrapper>
                        <VedleggNotis dynamisk språkTekstId={'ombarna.asyl.alert'} />
                    </VedleggNotisWrapper>
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge}
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[
                            OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                        ]
                    }
                    tilleggsinfo={
                        <AlertStripe variant={'info'}>
                            <SpråkTekst id={'felles.korteopphold.info'} />
                        </AlertStripe>
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legendSpråkId={
                        omBarnaDineSpørsmålSpråkId[
                            OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge
                        ]
                    }
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
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[
                            OmBarnaDineSpørsmålId.mottarKontantstøtteForBarnFraAnnetEøsland
                        ]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legendSpråkId={
                        omBarnaDineSpørsmålSpråkId[
                            OmBarnaDineSpørsmålId.hvemKontantstøtteFraAnnetEøsland
                        ]
                    }
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
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[
                            OmBarnaDineSpørsmålId.harEllerTildeltBarnehageplass
                        ]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={<TekstBlock block={hvemBarnehageplass.sporsmal} />}
                    skjemafelt={skjema.felter.hvemHarBarnehageplass}
                    søknadsdatafelt={barnDataKeySpørsmål.harBarnehageplass}
                    nullstillValgteBarn={
                        skjema.felter.harEllerTildeltBarnehageplass.verdi === ESvar.NEI
                    }
                    visFeilmelding={skjema.visFeilmeldinger}
                >
                    {hvemBarnehageplass.vedleggsnotis ? (
                        <VedleggNotis>
                            <Normaltekst>
                                {plainTekst(hvemBarnehageplass.vedleggsnotis)}
                            </Normaltekst>
                        </VedleggNotis>
                    ) : null}
                </HvilkeBarnCheckboxGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erAvdødPartnerForelder}
                    spørsmålTekstId={omBarnaDineSpørsmålSpråkId[søknad.erAvdødPartnerForelder.id]}
                />
                <HvilkeBarnCheckboxGruppe
                    legendSpråkId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.hvemAvdødPartner]
                    }
                    skjemafelt={skjema.felter.hvemAvdødPartner}
                    søknadsdatafelt={barnDataKeySpørsmål.andreForelderErDød}
                    nullstillValgteBarn={skjema.felter.erAvdødPartnerForelder.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>
        </Steg>
    );
};

export default OmBarnaDine;
