import React from 'react';

import { Alert } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import { Personopplysninger } from './Personopplysninger';
import { useOmdeg } from './useOmdeg';

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
                    <Alert variant={'warning'} inline>
                        <TekstBlock block={borPaaAdressen.alert} typografi={Typografi.BodyShort} />
                    </Alert>
                )}
            </KomponentGruppe>
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.værtINorgeITolvMåneder}
                    spørsmålDokument={oppholdtDegSammenhengende}
                    tilleggsinfo={
                        <TekstBlock
                            block={oppholdtDegSammenhengende.alert}
                            typografi={Typografi.BodyShort}
                        />
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
                    <Alert variant={'warning'} inline aria-live="polite">
                        <TekstBlock
                            block={planleggerAaBoSammenhengende.alert}
                            typografi={Typografi.BodyLong}
                        />
                    </Alert>
                )}
            </KomponentGruppe>
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.yrkesaktivFemÅr}
                    spørsmålDokument={medlemAvFolketrygden}
                />
                {skjema.felter.yrkesaktivFemÅr.verdi === ESvar.NEI && (
                    <Alert variant={'warning'} inline aria-live="polite">
                        <TekstBlock
                            block={medlemAvFolketrygden.alert}
                            typografi={Typografi.BodyShort}
                        />
                    </Alert>
                )}
            </KomponentGruppe>
        </Steg>
    );
};

export default OmDeg;
