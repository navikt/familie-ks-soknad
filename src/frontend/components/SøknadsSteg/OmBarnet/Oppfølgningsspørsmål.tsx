import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/barn';
import { Typografi } from '../../../typer/common';
import {
    IBarnehageplassPeriode,
    IEøsKontantstøttePeriode,
    IUtenlandsperiode,
} from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import { BarnehageplassPeriode } from '../../Felleskomponenter/Barnehagemodal/BarnehageplassPeriode';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { KontantstøttePeriode } from '../../Felleskomponenter/KontantstøttePeriode/KontantstøttePeriode';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { Utenlandsperiode } from '../../Felleskomponenter/UtenlandsoppholdModal/Utenlandsperiode';

const Oppfølgningsspørsmål: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    leggTilKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    fjernKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    registrerteEøsKontantstøttePerioder: Felt<IEøsKontantstøttePeriode[]>;
    leggTilBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    fjernBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    registrerteBarnehageplassPerioder: Felt<IBarnehageplassPeriode[]>;
}> = ({
    barn,
    skjema,
    leggTilUtenlandsperiode,
    fjernUtenlandsperiode,
    leggTilKontantstøttePeriode,
    fjernKontantstøttePeriode,
    registrerteEøsKontantstøttePerioder,
    leggTilBarnehageplassPeriode,
    fjernBarnehageplassPeriode,
    registrerteBarnehageplassPerioder,
}) => {
    const { tekster } = useApp();
    const teksterForSteg = tekster()[ESanitySteg.OM_BARNET];
    const {
        paagaaendeSoeknadYtelse,
        hvilketLandYtelse,
        planlagtBoSammenhengendeINorge,
        utbetaltForeldrepengerEllerEngangsstoenad,
        opplystBarnOppholdUtenforNorge,
        opplystFaarHarFaattEllerSoektYtelse,
    } = teksterForSteg;

    return (
        <>
            {skjema.felter.utbetaltForeldrepengerEllerEngangsstønad.erSynlig && (
                <KomponentGruppe>
                    <Informasjonsbolk
                        //TODO tekst om at barnet er adoptert
                        tittelId={'todo.ombarnet.utbetalt.foreldrepenger.engangsstønad'}
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.utbetaltForeldrepengerEllerEngangsstønad}
                        spørsmålDokument={utbetaltForeldrepengerEllerEngangsstoenad}
                    />
                </KomponentGruppe>
            )}
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittel={
                        <TekstBlock
                            block={opplystBarnOppholdUtenforNorge}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    }
                >
                    <>
                        <Utenlandsperiode
                            personType={PersonType.barn}
                            skjema={skjema}
                            leggTilUtenlandsperiode={leggTilUtenlandsperiode}
                            fjernUtenlandsperiode={fjernUtenlandsperiode}
                            registrerteUtenlandsperioder={
                                skjema.felter.barnRegistrerteUtenlandsperioder
                            }
                            barn={barn}
                        />
                    </>
                    {skjema.felter.planleggerÅBoINorge12Mnd.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.planleggerÅBoINorge12Mnd}
                                spørsmålDokument={planlagtBoSammenhengendeINorge}
                                barnetsNavn={barn.navn}
                            />
                            {skjema.felter.planleggerÅBoINorge12Mnd.verdi === ESvar.NEI && (
                                <AlertStripe variant={'warning'} dynamisk>
                                    <TekstBlock
                                        block={planlagtBoSammenhengendeINorge.alert}
                                        typografi={Typografi.BodyLong}
                                    />
                                </AlertStripe>
                            )}
                        </KomponentGruppe>
                    )}
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittel={
                        <TekstBlock
                            block={opplystFaarHarFaattEllerSoektYtelse}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    }
                >
                    <KomponentGruppe>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.pågåendeSøknadFraAnnetEøsLand}
                            spørsmålDokument={paagaaendeSoeknadYtelse}
                        />
                        {skjema.felter.pågåendeSøknadHvilketLand.erSynlig && (
                            <LandDropdown
                                felt={skjema.felter.pågåendeSøknadHvilketLand}
                                skjema={skjema}
                                kunEøs={true}
                                ekskluderNorge
                                label={<TekstBlock block={hvilketLandYtelse.sporsmal} />}
                            />
                        )}
                        <KontantstøttePeriode
                            skjema={skjema}
                            registrerteEøsKontantstøttePerioder={
                                registrerteEøsKontantstøttePerioder
                            }
                            tilhørendeJaNeiSpmFelt={skjema.felter.mottarEllerMottokEøsKontantstøtte}
                            leggTilKontantstøttePeriode={leggTilKontantstøttePeriode}
                            fjernKontantstøttePeriode={fjernKontantstøttePeriode}
                            barn={barn}
                            personType={PersonType.søker}
                        />
                    </KomponentGruppe>
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.harBarnehageplass].svar === ESvar.JA && (
                <KomponentGruppe>
                    <BarnehageplassPeriode
                        skjema={skjema}
                        registrerteBarnehageplassPerioder={registrerteBarnehageplassPerioder}
                        leggTilBarnehageplassPeriode={leggTilBarnehageplassPeriode}
                        fjernBarnehageplassPeriode={fjernBarnehageplassPeriode}
                        barn={barn}
                    />
                </KomponentGruppe>
            )}
        </>
    );
};

export default Oppfølgningsspørsmål;
