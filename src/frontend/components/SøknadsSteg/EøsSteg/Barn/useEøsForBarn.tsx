import { Dispatch, SetStateAction, useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { EøsBarnSpørsmålId } from './spørsmål';
import { useApp } from '../../../../context/AppContext';
import useInputFelt from '../../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFeltMedJaNeiAvhengighet from '../../../../hooks/useLanddropdownFeltMedJaNeiAvhengighet';
import { usePerioder } from '../../../../hooks/usePerioder';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../../typer/barn';
import { AlternativtSvarForInput, BarnetsId } from '../../../../typer/common';
import { Slektsforhold } from '../../../../typer/kontrakt/generelle';
import { IOmsorgsperson } from '../../../../typer/omsorgsperson';
import {
    IArbeidsperiode,
    IEøsKontantstøttePeriode,
    IPensjonsperiode,
    IUtbetalingsperiode,
} from '../../../../typer/perioder';
import { PersonType } from '../../../../typer/personType';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { valideringAdresse } from '../../../../utils/adresse';
import { skalSkjuleAndreForelderFelt, skalViseBorMedOmsorgsperson } from '../../../../utils/barn';
import { trimWhiteSpace } from '../../../../utils/hjelpefunksjoner';
import { formaterVerdiForCheckbox } from '../../../../utils/input';
import { svarForSpørsmålMedUkjent } from '../../../../utils/spørsmål';
import { ArbeidsperiodeSpørsmålsId } from '../../../Felleskomponenter/Arbeidsperiode/spørsmål';
import { KontantstøttePeriodeSpørsmålId } from '../../../Felleskomponenter/KontantstøttePeriode/spørsmål';
import { PensjonsperiodeSpørsmålId } from '../../../Felleskomponenter/Pensjonsmodal/spørsmål';
import { UtbetalingerSpørsmålId } from '../../../Felleskomponenter/UtbetalingerModal/spørsmål';
import { idNummerKeyPrefix } from '../idnummerUtils';

export const useEøsForBarn = (
    barnetsUuid: BarnetsId
): {
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    validerAlleSynligeFelter: () => void;
    oppdaterSøknad: () => void;
    leggTilPensjonsperiodeNorgeAndreForelder: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiodeNorgeAndreForelder: (periode: IPensjonsperiode) => void;
    leggTilAndreUtbetalingsperiodeAndreForelder: (periode: IUtbetalingsperiode) => void;
    fjernAndreUtbetalingsperiodeAndreForelder: (periode: IUtbetalingsperiode) => void;
    leggTilArbeidsperiodeNorgeAndreForelder: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiodeNorgeAndreForelder: (periode: IArbeidsperiode) => void;
    leggTilKontantstøttePeriodeAndreForelder: (periode: IEøsKontantstøttePeriode) => void;
    fjernKontantstøttePeriodeAndreForelder: (periode: IEøsKontantstøttePeriode) => void;
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
    settIdNummerFelterForBarn: Dispatch<SetStateAction<Felt<string>[]>>;
    idNummerFelterForBarn: Felt<string>[];
    idNummerFelterForAndreForelder: Felt<string>[];
    settIdNummerFelterForAndreForelder: Dispatch<SetStateAction<Felt<string>[]>>;
} => {
    const { søknad, settSøknad, tekster, plainTekst } = useApp();

    const eøsForBarnTekster = tekster().EØS_FOR_BARN;
    const forLangAdresseTekst = tekster().FELLES.formateringsfeilmeldinger.forLangAdresse;

    const [gjeldendeBarn] = useState<IBarnMedISøknad | undefined>(
        søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid)
    );

    const [idNummerFelterForBarn, settIdNummerFelterForBarn] = useState<Felt<string>[]>([]);
    const [idNummerFelterForAndreForelder, settIdNummerFelterForAndreForelder] = useState<
        Felt<string>[]
    >([]);

    if (!gjeldendeBarn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }
    const andreForelder = gjeldendeBarn.andreForelder;
    const omsorgsperson = gjeldendeBarn.omsorgsperson;
    const andreForelderErDød =
        gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA;

    /*--- SLEKTSFORHOLD ---*/
    const søkersSlektsforhold = useFelt<Slektsforhold | ''>({
        feltId: gjeldendeBarn[barnDataKeySpørsmål.søkersSlektsforhold].id,
        verdi: gjeldendeBarn[barnDataKeySpørsmål.søkersSlektsforhold].svar,
        valideringsfunksjon: (felt: FeltState<Slektsforhold | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, plainTekst(eøsForBarnTekster.slektsforhold.feilmelding));
        },
        skalFeltetVises: () => gjeldendeBarn.erFosterbarn.svar === ESvar.NEI,
    });
    const flettefelter = { barnetsNavn: gjeldendeBarn.navn };
    const søkersSlektsforholdSpesifisering = useInputFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.søkersSlektsforholdSpesifisering],
        feilmelding: eøsForBarnTekster.hvilkenRelasjon.feilmelding,
        skalVises: søkersSlektsforhold.verdi === Slektsforhold.ANNEN_RELASJON,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[\dA-Za-z\s\-\\,.]{4,60}$/)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(tekster().FELLES.formateringsfeilmeldinger.ugyldigRelasjon)
                  );
        },
        nullstillVedAvhengighetEndring: false,
    });

    /*--- BOSITUASJON ---*/
    const borMedAndreForelder = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.borMedAndreForelder],
        feilmelding: eøsForBarnTekster.borMedAndreForelder.feilmelding,
        nullstillVedAvhengighetEndring: true,
        skalSkjules:
            gjeldendeBarn.erFosterbarn.svar === ESvar.JA ||
            andreForelderErDød ||
            gjeldendeBarn.oppholderSegIInstitusjon.svar === ESvar.JA,
    });

    /*--- OMSORGSPERSON ---*/
    const borMedOmsorgsperson = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.borMedOmsorgsperson],
        feilmelding: eøsForBarnTekster.borMedOmsorgsperson.feilmelding,
        nullstillVedAvhengighetEndring: true,
        skalSkjules: !skalViseBorMedOmsorgsperson(
            borMedAndreForelder.verdi,
            gjeldendeBarn.borFastMedSøker.svar,
            gjeldendeBarn.oppholderSegIInstitusjon.svar,
            gjeldendeBarn.andreForelderErDød.svar,
            gjeldendeBarn.erFosterbarn.svar
        ),
    });

    const omsorgspersonNavn = useInputFelt({
        søknadsfelt: omsorgsperson && omsorgsperson.navn,
        feilmelding: eøsForBarnTekster.hvaHeterOmsorgspersonen.feilmelding,
        flettefelter: flettefelter,
        skalVises: borMedOmsorgsperson.verdi === ESvar.JA,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[A-Za-zæøåÆØÅ\s\-\\,.]{1,60}$/)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(tekster().FELLES.formateringsfeilmeldinger.ugyldigRelasjon)
                  );
        },
        nullstillVedAvhengighetEndring: false,
    });

    const omsorgspersonSlektsforhold = useFelt<Slektsforhold | ''>({
        feltId: omsorgsperson?.slektsforhold.id,
        verdi: omsorgsperson?.slektsforhold.svar ?? '',
        valideringsfunksjon: (felt: FeltState<Slektsforhold | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, plainTekst(eøsForBarnTekster.slektsforholdOmsorgsperson.feilmelding));
        },
        skalFeltetVises: avhengigheter =>
            gjeldendeBarn.erFosterbarn.svar === ESvar.NEI &&
            avhengigheter.borMedOmsorgsperson.verdi === ESvar.JA,
        avhengigheter: { borMedOmsorgsperson },
        nullstillVedAvhengighetEndring: false,
    });

    const omsorgpersonSlektsforholdSpesifisering = useInputFelt({
        søknadsfelt: omsorgsperson && omsorgsperson.slektsforholdSpesifisering,
        feilmelding: eøsForBarnTekster.hvilkenRelasjonOmsorgsperson.feilmelding,
        skalVises: omsorgspersonSlektsforhold.verdi === Slektsforhold.ANNEN_RELASJON,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[\dA-Za-zæøåÆØÅ\s\-\\,.]{4,60}$/)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(tekster().FELLES.formateringsfeilmeldinger.ugyldigRelasjon)
                  );
        },
        nullstillVedAvhengighetEndring: false,
    });

    const omsorgspersonIdNummerVetIkke = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(omsorgsperson?.idNummer.svar),
        feltId: EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke,
        skalFeltetVises: avhengigheter => avhengigheter.borMedOmsorgsperson.verdi === ESvar.JA,
        avhengigheter: { borMedOmsorgsperson },
    });

    const omsorgspersonIdNummer = useInputFeltMedUkjent({
        søknadsfelt: omsorgsperson && omsorgsperson.idNummer,
        avhengighet: omsorgspersonIdNummerVetIkke,
        feilmelding: eøsForBarnTekster.idNummerOmsorgsperson.feilmelding,
        skalVises: borMedOmsorgsperson.verdi === ESvar.JA,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[\dA-Za-zæøåÆØÅ\s\-.\\/]{4,20}$/)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(tekster().FELLES.formateringsfeilmeldinger.ugyldigIDnummer)
                  );
        },
        nullstillVedAvhengighetEndring: false,
    });

    const omsorgspersonAdresseVetIkke = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(omsorgsperson?.adresse.svar),
        feltId: EøsBarnSpørsmålId.omsorgspersonAdresseVetIkke,
        skalFeltetVises: avhengigheter => avhengigheter.borMedOmsorgsperson.verdi === ESvar.JA,
        avhengigheter: { borMedOmsorgsperson },
    });

    const omsorgspersonAdresse = useInputFeltMedUkjent({
        søknadsfelt: omsorgsperson && omsorgsperson.adresse,
        avhengighet: omsorgspersonAdresseVetIkke,
        feilmelding: eøsForBarnTekster.hvorBorOmsorgsperson.feilmelding,
        skalVises: borMedOmsorgsperson.verdi === ESvar.JA,
        customValidering: felt => valideringAdresse(felt, plainTekst(forLangAdresseTekst)),
    });

    const omsorgspersonArbeidUtland = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.arbeidUtland,
        feilmelding: eøsForBarnTekster.arbeidUtenforNorgeOmsorgsperson.feilmelding,
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const {
        fjernPeriode: fjernArbeidsperiodeUtlandOmsorgsperson,
        leggTilPeriode: leggTilArbeidsperiodeUtlandOmsorgsperson,
        registrertePerioder: omsorgspersonArbeidsperioderUtland,
    } = usePerioder<IArbeidsperiode>(
        `${ArbeidsperiodeSpørsmålsId.arbeidsperioder}-${PersonType.omsorgsperson}-utland`,
        omsorgsperson?.arbeidsperioderUtland ?? [],
        { omsorgspersonArbeidUtland },
        avhengigheter => avhengigheter.omsorgspersonArbeidUtland.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.omsorgspersonArbeidUtland.verdi === ESvar.NEI ||
                (avhengigheter?.omsorgspersonArbeidUtland.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          tekster().FELLES.modaler.arbeidsperiode.omsorgsperson.leggTilFeilmelding,
                          { gjelderUtland: true }
                      )
                  );
        }
    );

    const omsorgspersonArbeidNorge = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.arbeidNorge,
        feilmelding: eøsForBarnTekster.arbeidNorgeOmsorgsperson.feilmelding,
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const {
        fjernPeriode: fjernArbeidsperiodeNorgeOmsorgsperson,
        leggTilPeriode: leggTilArbeidsperiodeNorgeOmsorgsperson,
        registrertePerioder: omsorgspersonArbeidsperioderNorge,
    } = usePerioder<IArbeidsperiode>(
        `${ArbeidsperiodeSpørsmålsId.arbeidsperioder}-${PersonType.omsorgsperson}`,
        omsorgsperson?.arbeidsperioderNorge ?? [],
        { omsorgspersonArbeidNorge },
        avhengigheter => avhengigheter.omsorgspersonArbeidNorge.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.omsorgspersonArbeidNorge.verdi === ESvar.NEI ||
                (avhengigheter?.omsorgspersonArbeidNorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          tekster().FELLES.modaler.arbeidsperiode.omsorgsperson.leggTilFeilmelding,
                          { gjelderUtland: false }
                      )
                  );
        }
    );

    const omsorgspersonPensjonUtland = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.pensjonUtland,
        feilmelding: eøsForBarnTekster.pensjonUtlandOmsorgsperson.feilmelding,
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const {
        fjernPeriode: fjernPensjonsperiodeUtlandOmsorgsperson,
        leggTilPeriode: leggTilPensjonsperiodeUtlandOmsorgsperson,
        registrertePerioder: omsorgspersonPensjonsperioderUtland,
    } = usePerioder<IPensjonsperiode>(
        `${PensjonsperiodeSpørsmålId.pensjonsperioder}-${PersonType.omsorgsperson}-utland`,
        omsorgsperson?.pensjonsperioderUtland ?? [],
        { omsorgspersonPensjonUtland },
        avhengigheter => avhengigheter.omsorgspersonPensjonUtland.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.omsorgspersonPensjonUtland.verdi === ESvar.NEI ||
                (avhengigheter?.omsorgspersonPensjonUtland.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          tekster().FELLES.modaler.pensjonsperiode.omsorgsperson.leggTilFeilmelding,
                          { gjelderUtland: true }
                      )
                  );
        }
    );

    const omsorgspersonPensjonNorge = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.pensjonNorge,
        feilmelding: eøsForBarnTekster.pensjonNorgeOmsorgsperson.feilmelding,
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const {
        fjernPeriode: fjernPensjonsperiodeNorgeOmsorgsperson,
        leggTilPeriode: leggTilPensjonsperiodeNorgeOmsorgsperson,
        registrertePerioder: omsorgspersonPensjonsperioderNorge,
    } = usePerioder<IPensjonsperiode>(
        `${PensjonsperiodeSpørsmålId.pensjonsperioder}-${PersonType.omsorgsperson}`,
        omsorgsperson?.pensjonsperioderNorge ?? [],
        { omsorgspersonPensjonNorge },
        avhengigheter => avhengigheter.omsorgspersonPensjonNorge.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.omsorgspersonPensjonNorge.verdi === ESvar.NEI ||
                (avhengigheter?.omsorgspersonPensjonNorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          tekster().FELLES.modaler.pensjonsperiode.omsorgsperson.leggTilFeilmelding,
                          { gjelderUtland: false }
                      )
                  );
        }
    );

    const omsorgspersonAndreUtbetalinger = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.andreUtbetalinger,
        feilmelding: eøsForBarnTekster.utbetalingerOmsorgsperson.feilmelding,
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const {
        fjernPeriode: fjernAndreUtbetalingsperiodeOmsorgsperson,
        leggTilPeriode: leggTilAndreUtbetalingsperiodeOmsorgsperson,
        registrertePerioder: omsorgspersonAndreUtbetalingsperioder,
    } = usePerioder<IUtbetalingsperiode>(
        `${UtbetalingerSpørsmålId.utbetalingsperioder}-${PersonType.omsorgsperson}`,
        omsorgsperson?.andreUtbetalingsperioder ?? [],
        { omsorgspersonAndreUtbetalinger },
        avhengigheter => avhengigheter.omsorgspersonAndreUtbetalinger.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.omsorgspersonAndreUtbetalinger.verdi === ESvar.NEI ||
                (avhengigheter?.omsorgspersonAndreUtbetalinger.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          tekster().FELLES.modaler.andreUtbetalinger.omsorgsperson
                              .leggTilFeilmelding
                      )
                  );
        }
    );
    const omsorgspersonPågåendeSøknadFraAnnetEøsLand = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.pågåendeSøknadFraAnnetEøsLand,
        feilmelding: eøsForBarnTekster.paagaaendeSoeknadYtelseOmsorgsperson.feilmelding,
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const omsorgspersonPågåendeSøknadHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: omsorgsperson?.pågåendeSøknadHvilketLand,
        feilmelding: eøsForBarnTekster.hvilketLandSoektYtelseOmsorgsperson.feilmelding,
        avhengigSvarCondition: ESvar.JA,
        avhengighet: omsorgspersonPågåendeSøknadFraAnnetEøsLand,
    });

    const omsorgspersonKontantstøtteFraEøs = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.kontantstøtteFraEøs,
        feilmelding: eøsForBarnTekster.ytelseFraAnnetLandOmsorgsperson.feilmelding,
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const {
        fjernPeriode: fjernKontantstøttePeriodeOmsorgsperson,
        leggTilPeriode: leggTilKontantstøttePeriodeOmsorgsperson,
        registrertePerioder: omsorgspersonEøsKontantstøttePerioder,
    } = usePerioder<IEøsKontantstøttePeriode>(
        `${KontantstøttePeriodeSpørsmålId.kontantstøttePeriodeEøs}-${PersonType.omsorgsperson}`,
        omsorgsperson?.eøsKontantstøttePerioder ?? [],
        { omsorgspersonKontantstøtteFraEøs },
        avhengigheter => avhengigheter.omsorgspersonKontantstøtteFraEøs.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.omsorgspersonKontantstøtteFraEøs.verdi === ESvar.NEI ||
                (avhengigheter?.omsorgspersonKontantstøtteFraEøs.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          tekster().FELLES.modaler.eøsYtelse.omsorgsperson.leggTilFeilmelding
                      )
                  );
        }
    );

    /*--- BARNETS ADRESSE ---*/
    const barnetsAdresseVetIkke = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(gjeldendeBarn[barnDataKeySpørsmål.adresse].svar),
        feltId: EøsBarnSpørsmålId.barnetsAdresseVetIkke,
        skalFeltetVises: () =>
            (borMedAndreForelder.verdi === ESvar.JA &&
                skalSkjuleAndreForelderFelt(gjeldendeBarn)) ||
            gjeldendeBarn.erFosterbarn.svar === ESvar.JA,
        avhengigheter: { borMedAndreForelder },
    });

    const barnetsAdresse = useInputFeltMedUkjent({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.adresse],
        avhengighet: barnetsAdresseVetIkke,
        feilmelding: eøsForBarnTekster.hvorBorBarnet.feilmelding,
        flettefelter: flettefelter,
        skalVises:
            (borMedAndreForelder.verdi === ESvar.JA &&
                skalSkjuleAndreForelderFelt(gjeldendeBarn)) ||
            gjeldendeBarn.erFosterbarn.svar === ESvar.JA,
        customValidering: felt => valideringAdresse(felt, plainTekst(forLangAdresseTekst)),
    });

    /*--- ANDRE FORELDER ---*/
    const andreForelderAdresseVetIkke = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(andreForelder?.adresse.svar),
        feltId: EøsBarnSpørsmålId.andreForelderAdresseVetIkke,
        skalFeltetVises: () => !andreForelderErDød && !skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const andreForelderAdresse = useInputFeltMedUkjent({
        søknadsfelt: andreForelder && andreForelder[andreForelderDataKeySpørsmål.adresse],
        avhengighet: andreForelderAdresseVetIkke,
        feilmelding: eøsForBarnTekster.hvorBorAndreForelder.feilmelding,
        skalVises: !andreForelderErDød && !skalSkjuleAndreForelderFelt(gjeldendeBarn),
        customValidering: felt => valideringAdresse(felt, plainTekst(forLangAdresseTekst)),
    });

    const andreForelderArbeidNorge = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.arbeidNorge],
        feilmelding: andreForelderErDød
            ? eøsForBarnTekster.arbeidNorgeAndreForelderGjenlevende.feilmelding
            : eøsForBarnTekster.arbeidNorgeAndreForelder.feilmelding,
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const {
        fjernPeriode: fjernArbeidsperiodeNorgeAndreForelder,
        leggTilPeriode: leggTilArbeidsperiodeNorgeAndreForelder,
        registrertePerioder: andreForelderArbeidsperioderNorge,
    } = usePerioder<IArbeidsperiode>(
        `${ArbeidsperiodeSpørsmålsId.arbeidsperioder}-${PersonType.andreForelder}`,
        andreForelder?.arbeidsperioderNorge ?? [],
        { andreForelderArbeidNorge },
        avhengigheter => avhengigheter.andreForelderArbeidNorge.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderArbeidNorge.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderArbeidNorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          tekster().FELLES.modaler.arbeidsperiode.andreForelder.leggTilFeilmelding,
                          { gjelderUtland: false }
                      )
                  );
        }
    );

    const andreForelderPensjonNorge = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pensjonNorge],
        feilmelding: andreForelderErDød
            ? eøsForBarnTekster.pensjonNorgeAndreForelderGjenlevende.feilmelding
            : eøsForBarnTekster.pensjonNorgeAndreForelder.feilmelding,
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const {
        fjernPeriode: fjernPensjonsperiodeNorgeAndreForelder,
        leggTilPeriode: leggTilPensjonsperiodeNorgeAndreForelder,
        registrertePerioder: andreForelderPensjonsperioderNorge,
    } = usePerioder<IPensjonsperiode>(
        `${PensjonsperiodeSpørsmålId.pensjonsperioder}-${PersonType.andreForelder}`,
        andreForelder?.pensjonsperioderNorge ?? [],
        { andreForelderPensjonNorge },
        avhengigheter => avhengigheter.andreForelderPensjonNorge.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderPensjonNorge.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderPensjonNorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          tekster().FELLES.modaler.pensjonsperiode.andreForelder.leggTilFeilmelding,
                          { gjelderUtland: false }
                      )
                  );
        }
    );

    const andreForelderAndreUtbetalinger = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.andreUtbetalinger],
        feilmelding: andreForelderErDød
            ? eøsForBarnTekster.utbetalingerAndreForelderGjenlevende.feilmelding
            : eøsForBarnTekster.utbetalingerAndreForelder.feilmelding,
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const {
        fjernPeriode: fjernAndreUtbetalingsperiodeAndreForelder,
        leggTilPeriode: leggTilAndreUtbetalingsperiodeAndreForelder,
        registrertePerioder: andreForelderAndreUtbetalingsperioder,
    } = usePerioder<IUtbetalingsperiode>(
        `${UtbetalingerSpørsmålId.utbetalingsperioder}-${PersonType.andreForelder}`,
        andreForelder?.andreUtbetalingsperioder ?? [],
        { andreForelderAndreUtbetalinger },
        avhengigheter => avhengigheter.andreForelderAndreUtbetalinger.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderAndreUtbetalinger.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderAndreUtbetalinger.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          tekster().FELLES.modaler.andreUtbetalinger.andreForelder
                              .leggTilFeilmelding
                      )
                  );
        }
    );

    const andreForelderPågåendeSøknadFraAnnetEøsLand = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand],
        feilmelding: eøsForBarnTekster.paagaaendeSoeknadYtelseAndreForelder.feilmelding,
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn) || andreForelderErDød,
    });

    const andreForelderPågåendeSøknadHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pågåendeSøknadHvilketLand],
        feilmelding: eøsForBarnTekster.hvilketLandSoektYtelseAndreForelder.feilmelding,
        avhengigSvarCondition: ESvar.JA,
        avhengighet: andreForelderPågåendeSøknadFraAnnetEøsLand,
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
    });

    const andreForelderKontantstøtteFraEøs = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.kontantstøtteFraEøs],
        feilmelding: andreForelderErDød
            ? eøsForBarnTekster.ytelseFraAnnetLandAndreForelderGjenlevende.feilmelding
            : eøsForBarnTekster.ytelseFraAnnetLandAndreForelder.feilmelding,
        flettefelter: flettefelter,
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const {
        fjernPeriode: fjernKontantstøttePeriodeAndreForelder,
        leggTilPeriode: leggTilKontantstøttePeriodeAndreForelder,
        registrertePerioder: andreForelderEøsKontantstøttePerioder,
    } = usePerioder<IEøsKontantstøttePeriode>(
        `${KontantstøttePeriodeSpørsmålId.kontantstøttePeriodeEøs}-${PersonType.andreForelder}`,
        andreForelder?.eøsKontantstøttePerioder ?? [],
        { andreForelderKontantstøtteFraEøs },
        avhengigheter => avhengigheter.andreForelderKontantstøtteFraEøs.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderKontantstøtteFraEøs.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderKontantstøtteFraEøs.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          tekster().FELLES.modaler.eøsYtelse.andreForelder.leggTilFeilmelding
                      )
                  );
        }
    );

    const genererAndreForelder = (
        andreForelder: IAndreForelder
    ): { andreForelder: IAndreForelder } => ({
        andreForelder: {
            ...andreForelder,
            pensjonNorge: {
                ...andreForelder[andreForelderDataKeySpørsmål.pensjonNorge],
                svar: andreForelderPensjonNorge.verdi,
            },
            pensjonsperioderNorge:
                andreForelderPensjonNorge.verdi === ESvar.JA
                    ? andreForelderPensjonsperioderNorge.verdi
                    : [],
            andreUtbetalinger: {
                ...andreForelder[andreForelderDataKeySpørsmål.andreUtbetalinger],
                svar: andreForelderAndreUtbetalinger.verdi,
            },
            andreUtbetalingsperioder:
                andreForelderAndreUtbetalinger.verdi === ESvar.JA
                    ? andreForelderAndreUtbetalingsperioder.verdi
                    : [],
            arbeidNorge: {
                ...andreForelder[andreForelderDataKeySpørsmål.arbeidNorge],
                svar: andreForelderArbeidNorge.verdi,
            },
            arbeidsperioderNorge:
                andreForelderArbeidNorge.verdi === ESvar.JA
                    ? andreForelderArbeidsperioderNorge.verdi
                    : [],
            pågåendeSøknadFraAnnetEøsLand: {
                id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadFraAnnetEøsLand,
                svar: andreForelderPågåendeSøknadFraAnnetEøsLand.verdi,
            },
            pågåendeSøknadHvilketLand: {
                id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadHvilketLand,
                svar: andreForelderPågåendeSøknadHvilketLand.verdi,
            },
            kontantstøtteFraEøs: {
                ...andreForelder[andreForelderDataKeySpørsmål.kontantstøtteFraEøs],
                svar: andreForelderKontantstøtteFraEøs.verdi,
            },
            eøsKontantstøttePerioder:
                andreForelderKontantstøtteFraEøs.verdi === ESvar.JA
                    ? andreForelderEøsKontantstøttePerioder.verdi
                    : [],
            idNummer: idNummerFelterForAndreForelder.map(felt => ({
                land: felt.id.split(idNummerKeyPrefix)[1] as Alpha3Code,
                idnummer:
                    trimWhiteSpace(felt.verdi) === '' ? AlternativtSvarForInput.UKJENT : felt.verdi,
            })),
            adresse: {
                ...andreForelder[andreForelderDataKeySpørsmål.adresse],
                svar: trimWhiteSpace(
                    svarForSpørsmålMedUkjent(andreForelderAdresseVetIkke, andreForelderAdresse)
                ),
            },
        },
    });

    const genererOmsorgsperson = (): IOmsorgsperson => ({
        navn: {
            id: EøsBarnSpørsmålId.omsorgspersonNavn,
            svar: trimWhiteSpace(omsorgspersonNavn.verdi),
        },
        slektsforhold: {
            id: EøsBarnSpørsmålId.omsorgspersonSlektsforhold,
            svar: omsorgspersonSlektsforhold.verdi,
        },
        slektsforholdSpesifisering: {
            id: EøsBarnSpørsmålId.omsorgspersonSlektsforholdSpesifisering,
            svar: trimWhiteSpace(omsorgpersonSlektsforholdSpesifisering.verdi),
        },
        idNummer: {
            id: EøsBarnSpørsmålId.omsorgspersonIdNummer,
            svar: trimWhiteSpace(
                svarForSpørsmålMedUkjent(omsorgspersonIdNummerVetIkke, omsorgspersonIdNummer)
            ),
        },
        adresse: {
            id: EøsBarnSpørsmålId.omsorgspersonAdresse,
            svar: trimWhiteSpace(
                svarForSpørsmålMedUkjent(omsorgspersonAdresseVetIkke, omsorgspersonAdresse)
            ),
        },
        arbeidUtland: {
            id: EøsBarnSpørsmålId.omsorgspersonArbeidUtland,
            svar: omsorgspersonArbeidUtland.verdi,
        },
        arbeidsperioderUtland:
            omsorgspersonArbeidUtland.verdi === ESvar.JA
                ? omsorgspersonArbeidsperioderUtland.verdi
                : [],
        arbeidNorge: {
            id: EøsBarnSpørsmålId.omsorgspersonArbeidNorge,
            svar: omsorgspersonArbeidNorge.verdi,
        },
        arbeidsperioderNorge:
            omsorgspersonArbeidNorge.verdi === ESvar.JA
                ? omsorgspersonArbeidsperioderNorge.verdi
                : [],
        pensjonUtland: {
            id: EøsBarnSpørsmålId.omsorgspersonPensjonUtland,
            svar: omsorgspersonPensjonUtland.verdi,
        },
        pensjonsperioderUtland:
            omsorgspersonPensjonUtland.verdi === ESvar.JA
                ? omsorgspersonPensjonsperioderUtland.verdi
                : [],
        pensjonNorge: {
            id: EøsBarnSpørsmålId.omsorgspersonPensjonNorge,
            svar: omsorgspersonPensjonNorge.verdi,
        },
        pensjonsperioderNorge:
            omsorgspersonPensjonNorge.verdi === ESvar.JA
                ? omsorgspersonPensjonsperioderNorge.verdi
                : [],
        andreUtbetalinger: {
            id: EøsBarnSpørsmålId.omsorgspersonAndreUtbetalinger,
            svar: omsorgspersonAndreUtbetalinger.verdi,
        },
        andreUtbetalingsperioder:
            omsorgspersonAndreUtbetalinger.verdi === ESvar.JA
                ? omsorgspersonAndreUtbetalingsperioder.verdi
                : [],
        pågåendeSøknadFraAnnetEøsLand: {
            id: EøsBarnSpørsmålId.omsorgspersonPågåendeSøknadFraAnnetEøsLand,
            svar: omsorgspersonPågåendeSøknadFraAnnetEøsLand.verdi,
        },
        pågåendeSøknadHvilketLand: {
            id: EøsBarnSpørsmålId.omsorgspersonPågåendeSøknadHvilketLand,
            svar: omsorgspersonPågåendeSøknadHvilketLand.verdi,
        },
        kontantstøtteFraEøs: {
            id: EøsBarnSpørsmålId.omsorgspersonKontantstøtte,
            svar: omsorgspersonKontantstøtteFraEøs.verdi,
        },
        eøsKontantstøttePerioder:
            omsorgspersonKontantstøtteFraEøs.verdi === ESvar.JA
                ? omsorgspersonEøsKontantstøttePerioder.verdi
                : [],
    });

    const genererOppdatertBarn = (barn: IBarnMedISøknad): IBarnMedISøknad => {
        const barnMedSammeForelder = søknad.barnInkludertISøknaden.find(
            barn => barn.id === barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar
        );

        return {
            ...barn,
            idNummer: idNummerFelterForBarn.map(felt => ({
                land: felt.id.split(idNummerKeyPrefix)[1] as Alpha3Code,
                idnummer:
                    trimWhiteSpace(felt.verdi) === '' ? AlternativtSvarForInput.UKJENT : felt.verdi,
            })),
            søkersSlektsforhold: {
                ...barn.søkersSlektsforhold,
                svar: søkersSlektsforhold.verdi,
            },
            søkersSlektsforholdSpesifisering: {
                ...barn.søkersSlektsforholdSpesifisering,
                svar: søkersSlektsforholdSpesifisering.erSynlig
                    ? søkersSlektsforholdSpesifisering.verdi
                    : '',
            },
            borMedAndreForelder: {
                ...barn.borMedAndreForelder,
                svar: borMedAndreForelder.verdi,
            },
            borMedOmsorgsperson: {
                ...barn.borMedOmsorgsperson,
                svar: borMedOmsorgsperson.erSynlig ? borMedOmsorgsperson.verdi : null,
            },
            adresse: {
                ...barn.adresse,
                svar: trimWhiteSpace(
                    svarForSpørsmålMedUkjent(barnetsAdresseVetIkke, barnetsAdresse)
                ),
            },
            omsorgsperson: borMedOmsorgsperson.verdi === ESvar.JA ? genererOmsorgsperson() : null,
            ...(!!barn.andreForelder &&
                !barnMedSammeForelder &&
                genererAndreForelder(barn.andreForelder)),
        };
    };

    const oppdaterSøknad = () => {
        const oppdatertBarnInkludertISøknaden: IBarnMedISøknad[] =
            søknad.barnInkludertISøknaden.map(barn => {
                if (barn === gjeldendeBarn) {
                    return genererOppdatertBarn(gjeldendeBarn);
                } else {
                    const barnSkalOppdatereEnAnnensForelder =
                        barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar ===
                        gjeldendeBarn.id;
                    return !!barn.andreForelder && barnSkalOppdatereEnAnnensForelder
                        ? { ...barn, ...genererAndreForelder(barn.andreForelder) }
                        : barn;
                }
            });

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IEøsForBarnFeltTyper,
        string
    >({
        felter: {
            ...idNummerFelterForBarn.reduce(
                (objekt, felt) => ({
                    ...objekt,
                    [felt.id]: felt,
                }),
                {}
            ),
            ...idNummerFelterForAndreForelder.reduce(
                (objekt, felt) => ({
                    ...objekt,
                    [felt.id]: felt,
                }),
                {}
            ),
            andreForelderPensjonNorge,
            andreForelderPensjonsperioderNorge,
            andreForelderAndreUtbetalinger,
            andreForelderAndreUtbetalingsperioder,
            andreForelderArbeidNorge,
            andreForelderArbeidsperioderNorge,
            andreForelderPågåendeSøknadFraAnnetEøsLand,
            andreForelderPågåendeSøknadHvilketLand,
            andreForelderKontantstøtteFraEøs,
            andreForelderEøsKontantstøttePerioder,
            andreForelderAdresse,
            andreForelderAdresseVetIkke,
            søkersSlektsforhold,
            søkersSlektsforholdSpesifisering,
            borMedAndreForelder,
            omsorgspersonNavn,
            omsorgspersonSlektsforhold,
            omsorgpersonSlektsforholdSpesifisering,
            omsorgspersonIdNummer,
            omsorgspersonIdNummerVetIkke,
            omsorgspersonAdresse,
            omsorgspersonAdresseVetIkke,
            omsorgspersonArbeidUtland,
            omsorgspersonArbeidsperioderUtland,
            omsorgspersonArbeidNorge,
            omsorgspersonArbeidsperioderNorge,
            omsorgspersonPensjonUtland,
            omsorgspersonPensjonsperioderUtland,
            omsorgspersonPensjonNorge,
            omsorgspersonPensjonsperioderNorge,
            omsorgspersonAndreUtbetalinger,
            omsorgspersonAndreUtbetalingsperioder,
            omsorgspersonPågåendeSøknadFraAnnetEøsLand,
            omsorgspersonPågåendeSøknadHvilketLand,
            omsorgspersonKontantstøtteFraEøs,
            omsorgspersonEøsKontantstøttePerioder,
            barnetsAdresse,
            barnetsAdresseVetIkke,
            borMedOmsorgsperson,
        },
        skjemanavn: 'eøsForBarn',
    });

    return {
        skjema,
        barn: gjeldendeBarn,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        validerAlleSynligeFelter,
        oppdaterSøknad,
        leggTilPensjonsperiodeNorgeAndreForelder,
        fjernPensjonsperiodeNorgeAndreForelder,
        leggTilAndreUtbetalingsperiodeAndreForelder,
        fjernAndreUtbetalingsperiodeAndreForelder,
        leggTilArbeidsperiodeNorgeAndreForelder,
        fjernArbeidsperiodeNorgeAndreForelder,
        leggTilKontantstøttePeriodeAndreForelder,
        fjernKontantstøttePeriodeAndreForelder,
        settIdNummerFelterForBarn,
        idNummerFelterForBarn,
        idNummerFelterForAndreForelder,
        settIdNummerFelterForAndreForelder,
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
    };
};
