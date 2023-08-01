import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { Personopplysninger } from './Personopplysninger';
import { useOmdeg } from './useOmdeg';
import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

const OmDeg: React.FC = () => {
    const { tekster } = useApp();

    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } = useOmdeg();

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
            tittel={<TekstBlock block={omDegTittel} typografi={Typografi.StegHeadingH1} />}
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
                        <TekstBlock block={borPaaAdressen.alert} typografi={Typografi.BodyShort} />
                    </AlertStripe>
                )}
            </KomponentGruppe>
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.værtINorgeITolvMåneder}
                    spørsmålDokument={oppholdtDegSammenhengende}
                    tilleggsinfo={
                        <AlertStripe variant={'info'}>
                            <TekstBlock
                                block={oppholdtDegSammenhengende.alert}
                                typografi={Typografi.BodyShort}
                            />
                        </AlertStripe>
                    }
                />
            </KomponentGruppe>
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                    spørsmålDokument={planleggerAaBoSammenhengende}
                />
                {skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                    <AlertStripe variant={'warning'} dynamisk>
                        <TekstBlock
                            block={planleggerAaBoSammenhengende.alert}
                            typografi={Typografi.BodyLong}
                        />
                    </AlertStripe>
                )}
            </KomponentGruppe>
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.yrkesaktivFemÅr}
                    spørsmålDokument={medlemAvFolketrygden}
                />
                {skjema.felter.yrkesaktivFemÅr.verdi === ESvar.NEI && (
                    <AlertStripe variant={'warning'} dynamisk>
                        <TekstBlock
                            block={medlemAvFolketrygden.alert}
                            typografi={Typografi.BodyShort}
                        />
                    </AlertStripe>
                )}
            </KomponentGruppe>
        </Steg>
    );
};

export default OmDeg;
