import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { Utenlandsperiode } from '../../Felleskomponenter/UtenlandsoppholdModal/Utenlandsperiode';
import { Personopplysninger } from './Personopplysninger';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { tekster } = useApp();

    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
    } = useOmdeg();

    const {
        [ESanitySteg.OM_DEG]: {
            omDegTittel,
            borPaaAdressen,
            oppholdtDegSammenhengende,
            planleggerAaBoSammenhengende,
            medlemAvFolketrygden,
        },
    } = tekster();

    return (
        <Steg
            tittel={<TekstBlock block={omDegTittel} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <KomponentGruppe>
                <Personopplysninger />
            </KomponentGruppe>

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.borPåRegistrertAdresse}
                    spørsmålDokument={borPaaAdressen}
                />

                {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                    <AlertStripe variant={'warning'}>
                        <TekstBlock block={borPaaAdressen.alert} />
                    </AlertStripe>
                )}
            </KomponentGruppe>
            {skjema.felter.værtINorgeITolvMåneder.erSynlig && (
                <KomponentGruppe dynamisk>
                    <>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.værtINorgeITolvMåneder}
                            spørsmålDokument={oppholdtDegSammenhengende}
                            tilleggsinfo={
                                <AlertStripe variant={'info'}>
                                    <TekstBlock block={oppholdtDegSammenhengende.alert} />
                                </AlertStripe>
                            }
                        />
                        {skjema.felter.værtINorgeITolvMåneder.verdi === ESvar.NEI && (
                            <Utenlandsperiode
                                personType={PersonType.Søker}
                                skjema={skjema}
                                leggTilUtenlandsperiode={leggTilUtenlandsperiode}
                                fjernPeriodeUtenlandsperiode={fjernUtenlandsperiode}
                                registrerteUtenlandsperioder={
                                    skjema.felter.registrerteUtenlandsperioder
                                }
                            />
                        )}
                    </>
                    {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                                spørsmålDokument={planleggerAaBoSammenhengende}
                            />
                            {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig &&
                                skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                                    <AlertStripe variant={'warning'} dynamisk>
                                        <TekstBlock block={planleggerAaBoSammenhengende.alert} />
                                    </AlertStripe>
                                )}
                        </KomponentGruppe>
                    )}
                </KomponentGruppe>
            )}
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.yrkesaktivFemÅr}
                    spørsmålDokument={medlemAvFolketrygden}
                />
                {skjema.felter.yrkesaktivFemÅr.verdi === ESvar.NEI && (
                    <AlertStripe variant={'warning'} dynamisk>
                        <TekstBlock block={medlemAvFolketrygden.alert} />
                    </AlertStripe>
                )}
            </KomponentGruppe>
        </Steg>
    );
};

export default OmDeg;
