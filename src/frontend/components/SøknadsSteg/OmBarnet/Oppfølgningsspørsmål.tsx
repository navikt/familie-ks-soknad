import React from 'react';

import { Alert } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

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
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import { BarnehageplassPeriode } from '../../Felleskomponenter/Barnehagemodal/BarnehageplassPeriode';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { KontantstøttePeriode } from '../../Felleskomponenter/KontantstøttePeriode/KontantstøttePeriode';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { Utenlandsperiode } from '../../Felleskomponenter/UtenlandsoppholdModal/Utenlandsperiode';

import { IOmBarnetTekstinnhold } from './innholdTyper';

const Oppfølgningsspørsmål: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
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
    const { tekster, plainTekst } = useApp();
    const teksterForSteg: IOmBarnetTekstinnhold = tekster()[ESanitySteg.OM_BARNET];
    const {
        paagaaendeSoeknadYtelse,
        hvilketLandYtelse,
        planlagtBoSammenhengendeINorge,
        utbetaltForeldrepengerEllerEngangsstoenad,
        opplystBarnOppholdUtenforNorge,
        opplystFaarHarFaattEllerSoektYtelse,
        opplystAdoptert,
    } = teksterForSteg;

    const barnetsNavn = barn.navn;

    return (
        <>
            {barn[barnDataKeySpørsmål.erAdoptert].svar === ESvar.JA && (
                <SkjemaFieldset legend={plainTekst(opplystAdoptert, { barnetsNavn })}>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.utbetaltForeldrepengerEllerEngangsstønad}
                        spørsmålDokument={utbetaltForeldrepengerEllerEngangsstoenad}
                    />
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <SkjemaFieldset
                    legend={plainTekst(opplystBarnOppholdUtenforNorge, { barnetsNavn })}
                >
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
                    {skjema.felter.planleggerÅBoINorge12Mnd.erSynlig && (
                        <KomponentGruppe dynamisk>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.planleggerÅBoINorge12Mnd}
                                spørsmålDokument={planlagtBoSammenhengendeINorge}
                                flettefelter={{ barnetsNavn }}
                            />
                            {skjema.felter.planleggerÅBoINorge12Mnd.verdi === ESvar.NEI && (
                                <Alert variant={'warning'} aria-live="polite">
                                    <TekstBlock
                                        block={planlagtBoSammenhengendeINorge.alert}
                                        typografi={Typografi.BodyLong}
                                    />
                                </Alert>
                            )}
                        </KomponentGruppe>
                    )}
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland].svar === ESvar.JA && (
                <SkjemaFieldset
                    legend={plainTekst(opplystFaarHarFaattEllerSoektYtelse, { barnetsNavn })}
                >
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
                        registrerteEøsKontantstøttePerioder={registrerteEøsKontantstøttePerioder}
                        tilhørendeJaNeiSpmFelt={skjema.felter.mottarEllerMottokEøsKontantstøtte}
                        leggTilKontantstøttePeriode={leggTilKontantstøttePeriode}
                        fjernKontantstøttePeriode={fjernKontantstøttePeriode}
                        barn={barn}
                        personType={PersonType.søker}
                    />
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.harBarnehageplass].svar === ESvar.JA && (
                <BarnehageplassPeriode
                    skjema={skjema}
                    registrerteBarnehageplassPerioder={registrerteBarnehageplassPerioder}
                    leggTilBarnehageplassPeriode={leggTilBarnehageplassPeriode}
                    fjernBarnehageplassPeriode={fjernBarnehageplassPeriode}
                    barn={barn}
                />
            )}
        </>
    );
};

export default Oppfølgningsspørsmål;
