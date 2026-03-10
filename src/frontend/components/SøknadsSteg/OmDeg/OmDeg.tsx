import React from 'react';

import { InlineMessage } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import styles from './OmDeg.module.css';
import { Personopplysninger } from './Personopplysninger';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { tekster } = useAppContext();

    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } = useOmdeg();

    const {
        [ESanitySteg.OM_DEG]: {
            omDegTittel,
            omDegGuide,
            borPaaAdressen,
            oppholdtDegSammenhengende,
            planleggerAaBoSammenhengende,
            medlemAvFolketrygden,
        },
    } = tekster();

    return (
        <Steg
            tittel={<TekstBlock block={omDegTittel} />}
            guide={<TekstBlock block={omDegGuide} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <Personopplysninger />
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.borPåRegistrertAdresse}
                    spørsmålDokument={borPaaAdressen}
                />
                {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                    <div className={styles.textBlockContainer}>
                        <InlineMessage status={'warning'}>
                            <TekstBlock block={borPaaAdressen.alert} typografi={Typografi.BodyShort} />
                        </InlineMessage>
                    </div>
                )}
            </KomponentGruppe>
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.værtINorgeITolvMåneder}
                spørsmålDokument={oppholdtDegSammenhengende}
                tilleggsinfo={<TekstBlock block={oppholdtDegSammenhengende.alert} typografi={Typografi.BodyShort} />}
            />
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                    spørsmålDokument={planleggerAaBoSammenhengende}
                />
                {skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                    <div className={styles.textBlockContainer}>
                        <InlineMessage status={'warning'}>
                            <TekstBlock block={planleggerAaBoSammenhengende.alert} typografi={Typografi.BodyLong} />
                        </InlineMessage>
                    </div>
                )}
            </KomponentGruppe>
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.yrkesaktivFemÅr}
                    spørsmålDokument={medlemAvFolketrygden}
                />
                {skjema.felter.yrkesaktivFemÅr.verdi === ESvar.NEI && (
                    <div className={styles.textBlockContainer}>
                        <InlineMessage status={'warning'}>
                            <TekstBlock block={medlemAvFolketrygden.alert} typografi={Typografi.BodyShort} />
                        </InlineMessage>
                    </div>
                )}
            </KomponentGruppe>
        </Steg>
    );
};

export default OmDeg;
