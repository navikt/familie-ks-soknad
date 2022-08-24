import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { UtenlandsoppholdModal } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { Personopplysninger } from './Personopplysninger';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from './spørsmål';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { erÅpen, toggleModal } = useModal();
    const { tekster, localeString } = useApp();
    const {
        [ESanitySteg.OM_DEG]: {
            omDegTittel,
            medlemFolketrygden,
            borDuPaDenneAdressen,
            sammenhengendeNorgeSoker,
            sammenhengendeNorgeMerEnnTolvManeder,
        },
        modaler: { utenlandsoppholdSoker },
    } = tekster();

    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
    } = useOmdeg();

    return (
        <Steg
            tittel={<TekstBlock block={omDegTittel.tittel} />}
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
                    spørsmålTekstId={omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse]}
                />

                {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                    <AlertStripe variant={'warning'}>
                        <TekstBlock block={borDuPaDenneAdressen.alert.alertTekst} />
                    </AlertStripe>
                )}
            </KomponentGruppe>
            {skjema.felter.værtINorgeITolvMåneder.erSynlig && (
                <KomponentGruppe dynamisk>
                    <>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.værtINorgeITolvMåneder}
                            spørsmålTekstId={
                                omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder]
                            }
                            tilleggsinfo={
                                <AlertStripe variant={'info'}>
                                    {localeString(sammenhengendeNorgeSoker.beskrivelse)}
                                </AlertStripe>
                            }
                        />
                        {skjema.felter.værtINorgeITolvMåneder.verdi === ESvar.NEI && (
                            <>
                                {utenlandsperioder.map((periode, index) => (
                                    <UtenlandsperiodeOppsummering
                                        key={index}
                                        periode={periode}
                                        nummer={index + 1}
                                        fjernPeriodeCallback={fjernUtenlandsperiode}
                                    />
                                ))}
                                {utenlandsperioder.length > 0 && (
                                    <Element>
                                        {localeString(utenlandsoppholdSoker.flerePerioderSporsmal)}
                                    </Element>
                                )}
                                <LeggTilKnapp
                                    språkTekst={'felles.leggtilutenlands.knapp'}
                                    onClick={toggleModal}
                                    id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                                    feilmelding={
                                        skjema.felter.registrerteUtenlandsperioder.erSynlig &&
                                        skjema.felter.registrerteUtenlandsperioder.feilmelding &&
                                        skjema.visFeilmeldinger && (
                                            <SpråkTekst
                                                id={'felles.leggtilutenlands.feilmelding'}
                                            />
                                        )
                                    }
                                />
                            </>
                        )}
                    </>
                    {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                                spørsmålTekstId={
                                    omDegSpørsmålSpråkId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]
                                }
                            />
                            {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig &&
                                skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                                    <AlertStripe variant={'warning'} dynamisk>
                                        <TekstBlock
                                            block={
                                                sammenhengendeNorgeMerEnnTolvManeder.alert
                                                    .alertTekst
                                            }
                                        />
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
                    spørsmålTekstId={localeString(medlemFolketrygden.sporsmal)}
                />
                {skjema.felter.yrkesaktivFemÅr.verdi === ESvar.NEI && (
                    <AlertStripe variant={'warning'} dynamisk>
                        <TekstBlock block={medlemFolketrygden.alert.alertTekst} />
                    </AlertStripe>
                )}
            </KomponentGruppe>
            <UtenlandsoppholdModal
                erÅpen={erÅpen}
                toggleModal={toggleModal}
                onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
            />
        </Steg>
    );
};

export default OmDeg;
