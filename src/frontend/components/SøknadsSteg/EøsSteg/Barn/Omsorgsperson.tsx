import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import type { ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../../context/AppContext';
import { IBarnMedISøknad } from '../../../../typer/barn';
import {
    IArbeidsperiode,
    IEøsKontantstøttePeriode,
    IPensjonsperiode,
    IUtbetalingsperiode,
} from '../../../../typer/perioder';
import { PersonType } from '../../../../typer/personType';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import { LandDropdown } from '../../../Felleskomponenter/Dropdowns/LandDropdown';
import SlektsforholdDropdown from '../../../Felleskomponenter/Dropdowns/SlektsforholdDropdown';
import JaNeiSpm from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import { KontantstøttePeriode } from '../../../Felleskomponenter/KontantstøttePeriode/KontantstøttePeriode';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaCheckbox } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';

interface OmsorgspersonProps {
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    periodeFunksjoner: {
        leggTilArbeidsperiodeUtlandOmsorgsperson: (periode: IArbeidsperiode) => void;
        fjernArbeidsperiodeUtlandOmsorgsperson: (periode: IArbeidsperiode) => void;
        leggTilArbeidsperiodeNorgeOmsorgsperson: (periode: IArbeidsperiode) => void;
        fjernArbeidsperiodeNorgeOmsorgsperson: (periode: IArbeidsperiode) => void;
        leggTilPensjonsperiodeUtlandOmsorgsperson: (periode: IPensjonsperiode) => void;
        fjernPensjonsperiodeUtlandOmsorgsperson: (periode: IPensjonsperiode) => void;
        leggTilPensjonsperiodeNorgeOmsorgsperson: (periode: IPensjonsperiode) => void;
        fjernPensjonsperiodeNorgeOmsorgsperson: (periode: IPensjonsperiode) => void;
        leggTilAndreUtbetalingsperiodeOmsorgsperson: (periode: IUtbetalingsperiode) => void;
        fjernAndreUtbetalingsperiodeOmsorgsperson: (periode: IUtbetalingsperiode) => void;
        leggTilKontantstøttePeriodeOmsorgsperson: (periode: IEøsKontantstøttePeriode) => void;
        fjernKontantstøttePeriodeOmsorgsperson: (periode: IEøsKontantstøttePeriode) => void;
    };
}

const Omsorgsperson: React.FC<OmsorgspersonProps> = ({ skjema, barn, periodeFunksjoner }) => {
    const { plainTekst, tekster } = useAppContext();
    const eøsForBarnTekster = tekster().EØS_FOR_BARN;
    const {
        leggTilArbeidsperiodeUtlandOmsorgsperson,
        fjernArbeidsperiodeUtlandOmsorgsperson,
        leggTilArbeidsperiodeNorgeOmsorgsperson,
        fjernArbeidsperiodeNorgeOmsorgsperson,
        leggTilPensjonsperiodeUtlandOmsorgsperson,
        fjernPensjonsperiodeUtlandOmsorgsperson,
        leggTilPensjonsperiodeNorgeOmsorgsperson,
        fjernPensjonsperiodeNorgeOmsorgsperson,
        leggTilAndreUtbetalingsperiodeOmsorgsperson,
        fjernAndreUtbetalingsperiodeOmsorgsperson,
        leggTilKontantstøttePeriodeOmsorgsperson,
        fjernKontantstøttePeriodeOmsorgsperson,
    } = periodeFunksjoner;
    const flettefelter = { barnetsNavn: barn.navn };

    return (
        <SkjemaFieldset
            legend={plainTekst(eøsForBarnTekster.oppgittIkkeBorFastSammenMedDeg, flettefelter)}
        >
            <SkjemaFeltInput
                felt={skjema.felter.omsorgspersonNavn}
                visFeilmeldinger={skjema.visFeilmeldinger}
                label={<TekstBlock block={eøsForBarnTekster.hvaHeterOmsorgspersonen.sporsmal} />}
            />
            {skjema.felter.omsorgspersonSlektsforhold.erSynlig && (
                <SlektsforholdDropdown
                    felt={skjema.felter.omsorgspersonSlektsforhold}
                    skjema={skjema}
                    placeholder={plainTekst(
                        eøsForBarnTekster.valgalternativSlektsforholdPlaceholder
                    )}
                    label={
                        <TekstBlock
                            block={eøsForBarnTekster.slektsforholdOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    gjelderSøker={false}
                />
            )}
            {skjema.felter.omsorgpersonSlektsforholdSpesifisering.erSynlig && (
                <SkjemaFeltInput
                    felt={skjema.felter.omsorgpersonSlektsforholdSpesifisering}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={
                        <TekstBlock
                            block={eøsForBarnTekster.hvilkenRelasjonOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                />
            )}
            <div>
                <SkjemaFeltInput
                    felt={skjema.felter.omsorgspersonIdNummer}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={<TekstBlock block={eøsForBarnTekster.idNummerOmsorgsperson.sporsmal} />}
                    disabled={skjema.felter.omsorgspersonIdNummerVetIkke.verdi === ESvar.JA}
                />
                <SkjemaCheckbox
                    felt={skjema.felter.omsorgspersonIdNummerVetIkke}
                    label={plainTekst(eøsForBarnTekster.idNummerOmsorgsperson.checkboxLabel)}
                />
            </div>
            <div>
                <SkjemaFeltInput
                    felt={skjema.felter.omsorgspersonAdresse}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={<TekstBlock block={eøsForBarnTekster.hvorBorOmsorgsperson.sporsmal} />}
                    description={plainTekst(eøsForBarnTekster.hvorBorOmsorgsperson.beskrivelse)}
                    disabled={skjema.felter.omsorgspersonAdresseVetIkke.verdi === ESvar.JA}
                />
                <SkjemaCheckbox
                    felt={skjema.felter.omsorgspersonAdresseVetIkke}
                    label={plainTekst(eøsForBarnTekster.hvorBorOmsorgsperson.checkboxLabel)}
                />
            </div>
            <Arbeidsperiode
                skjema={skjema}
                leggTilArbeidsperiode={leggTilArbeidsperiodeUtlandOmsorgsperson}
                fjernArbeidsperiode={fjernArbeidsperiodeUtlandOmsorgsperson}
                arbeiderEllerArbeidetFelt={skjema.felter.omsorgspersonArbeidUtland}
                registrerteArbeidsperioder={skjema.felter.omsorgspersonArbeidsperioderUtland}
                gjelderUtlandet
                personType={PersonType.omsorgsperson}
                barn={barn}
            />
            <Arbeidsperiode
                skjema={skjema}
                leggTilArbeidsperiode={leggTilArbeidsperiodeNorgeOmsorgsperson}
                fjernArbeidsperiode={fjernArbeidsperiodeNorgeOmsorgsperson}
                arbeiderEllerArbeidetFelt={skjema.felter.omsorgspersonArbeidNorge}
                registrerteArbeidsperioder={skjema.felter.omsorgspersonArbeidsperioderNorge}
                gjelderUtlandet={false}
                personType={PersonType.omsorgsperson}
                barn={barn}
            />
            <Pensjonsperiode
                skjema={skjema}
                mottarEllerMottattPensjonFelt={skjema.felter.omsorgspersonPensjonUtland}
                leggTilPensjonsperiode={leggTilPensjonsperiodeUtlandOmsorgsperson}
                fjernPensjonsperiode={fjernPensjonsperiodeUtlandOmsorgsperson}
                personType={PersonType.omsorgsperson}
                barn={barn}
                gjelderUtlandet={true}
                registrertePensjonsperioder={skjema.felter.omsorgspersonPensjonsperioderUtland}
            />
            <Pensjonsperiode
                skjema={skjema}
                mottarEllerMottattPensjonFelt={skjema.felter.omsorgspersonPensjonNorge}
                leggTilPensjonsperiode={leggTilPensjonsperiodeNorgeOmsorgsperson}
                fjernPensjonsperiode={fjernPensjonsperiodeNorgeOmsorgsperson}
                personType={PersonType.omsorgsperson}
                barn={barn}
                gjelderUtlandet={false}
                registrertePensjonsperioder={skjema.felter.omsorgspersonPensjonsperioderNorge}
            />
            <Utbetalingsperiode
                skjema={skjema}
                tilhørendeJaNeiSpmFelt={skjema.felter.omsorgspersonAndreUtbetalinger}
                leggTilUtbetalingsperiode={leggTilAndreUtbetalingsperiodeOmsorgsperson}
                fjernUtbetalingsperiode={fjernAndreUtbetalingsperiodeOmsorgsperson}
                personType={PersonType.omsorgsperson}
                barn={barn}
                registrerteUtbetalingsperioder={skjema.felter.omsorgspersonAndreUtbetalingsperioder}
            />
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.omsorgspersonPågåendeSøknadFraAnnetEøsLand}
                spørsmålDokument={eøsForBarnTekster.paagaaendeSoeknadYtelseOmsorgsperson}
                flettefelter={flettefelter}
                inkluderVetIkke
            />
            {skjema.felter.omsorgspersonPågåendeSøknadHvilketLand.erSynlig && (
                <LandDropdown
                    felt={skjema.felter.omsorgspersonPågåendeSøknadHvilketLand}
                    skjema={skjema}
                    kunEøs={true}
                    ekskluderNorge
                    label={
                        <TekstBlock
                            block={eøsForBarnTekster.hvilketLandSoektYtelseOmsorgsperson.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                />
            )}
            <KontantstøttePeriode
                skjema={skjema}
                tilhørendeJaNeiSpmFelt={skjema.felter.omsorgspersonKontantstøtteFraEøs}
                registrerteEøsKontantstøttePerioder={
                    skjema.felter.omsorgspersonEøsKontantstøttePerioder
                }
                leggTilKontantstøttePeriode={leggTilKontantstøttePeriodeOmsorgsperson}
                fjernKontantstøttePeriode={fjernKontantstøttePeriodeOmsorgsperson}
                barn={barn}
                personType={PersonType.omsorgsperson}
            />
        </SkjemaFieldset>
    );
};

export default Omsorgsperson;
