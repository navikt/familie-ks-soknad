import { LocaleType } from '@navikt/familie-sprakvelger';

import {
    EøsBarnSpørsmålId,
    eøsBarnSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../typer/barn';
import { ERegistrertBostedType, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadIKontraktBarn } from '../../typer/kontrakt/v1';
import { ISøker } from '../../typer/person';
import { PersonType } from '../../typer/personType';
import { ESanitySteg } from '../../typer/sanity/sanity';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknadSpørsmålMap } from '../../typer/spørsmål';
import { hentTekster } from '../språk';
import { andreForelderTilISøknadsfelt } from './andreForelder';
import { tilIBarnehageplassPeriodeIKontraktFormat } from './barnehageplassperioder';
import { tilIEøsKontantstøttePeriodeIKontraktFormat } from './eøsKontantstøttePeriode';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekstGammel,
    språktekstIdFraSpørsmålId,
    spørmålISøknadsFormat,
    søknadsfeltBarn,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { omsorgspersonTilISøknadsfelt } from './omsorgsperson';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

export const barnISøknadsFormat = (
    barn: IBarnMedISøknad,
    søker: ISøker,
    valgtSpråk: LocaleType,
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord
): ISøknadIKontraktBarn => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
        id,
        barnErFyltUt,
        ident,
        navn,
        borMedSøker,
        alder,
        adressebeskyttelse,
        andreForelder,
        omsorgsperson,
        utenlandsperioder,
        // Nye felter under utvikling av EØS full
        eøsKontantstøttePerioder,
        barnehageplassPerioder,
        idNummer,
        triggetEøs,
        adresse,
        // resterende felter, hvor alle må være av type ISøknadSpørsmål
        ...barnSpørsmål
    } = barn;
    const typetBarnSpørsmål = barnSpørsmål as unknown as ISøknadSpørsmålMap;
    const fellesTekster = tekster[ESanitySteg.FELLES];

    const registertBostedVerdi = (): ERegistrertBostedType => {
        /**
         * 4 caser:
         *
         * 1. Adressesperre
         * 2. Manuelt registrert, "Ikke fylt inn"
         * 3. Bor med søker "registrert på søkers adresse"
         * 4. Bor ikke med søker "registrert på annen adresse"
         */
        if (adressebeskyttelse) {
            return ERegistrertBostedType.ADRESSESPERRE;
        }

        switch (borMedSøker) {
            case undefined:
                return ERegistrertBostedType.IKKE_FYLT_INN;
            case true:
                return ERegistrertBostedType.REGISTRERT_SOKERS_ADRESSE;
            case false:
                return ERegistrertBostedType.REGISTRERT_ANNEN_ADRESSE;
            default:
                return ERegistrertBostedType.IKKE_FYLT_INN;
        }
    };

    return {
        harEøsSteg: triggetEøs || søker.triggetEøs,
        navn: søknadsfeltBarn('pdf.barn.navn.label', sammeVerdiAlleSpråk(navn), barn),
        ident: søknadsfeltBarn(
            'pdf.barn.ident.label',
            ident ? sammeVerdiAlleSpråk(ident) : hentTekster('pdf.barn.ikke-oppgitt'),
            barn
        ),
        registrertBostedType: søknadsfeltBarn(
            'hvilkebarn.barn.bosted',
            sammeVerdiAlleSpråk(registertBostedVerdi()),
            barn
        ),
        alder: alder
            ? søknadsfeltBarn('pdf.barn.alder.label', hentTekster('felles.år', { alder }), barn)
            : null,
        utenlandsperioder: utenlandsperioder.map((periode, index) =>
            utenlandsperiodeTilISøknadsfelt(
                periode,
                index + 1,
                fellesTekster.modaler.utenlandsopphold[PersonType.barn],
                tilRestLocaleRecord
            )
        ),
        eøsKontantstøttePerioder: eøsKontantstøttePerioder.map((periode, index) =>
            tilIEøsKontantstøttePeriodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                barn,
                personType: PersonType.søker,
            })
        ),
        barnehageplassPerioder: barnehageplassPerioder.map((periode, index) =>
            tilIBarnehageplassPeriodeIKontraktFormat({ periode, periodeNummer: index + 1 })
        ),
        idNummer: idNummer.map(idnummerObj =>
            idNummerTilISøknadsfelt(
                idnummerObj,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummer],
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerUkjent],
                valgtSpråk,
                navn
            )
        ),
        andreForelder: andreForelder
            ? andreForelderTilISøknadsfelt(andreForelder, barn, valgtSpråk)
            : null,

        omsorgsperson: omsorgsperson ? omsorgspersonTilISøknadsfelt(omsorgsperson, barn) : null,
        spørsmål: {
            ...spørmålISøknadsFormat(typetBarnSpørsmål, {
                navn: navn,
                barn: navn,
            }),
            [barnDataKeySpørsmål.adresse]: søknadsfeltBarn(
                språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.barnetsAdresse),
                sammeVerdiAlleSpråkEllerUkjentSpråktekstGammel(
                    adresse.svar,
                    eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.barnetsAdresseVetIkke]
                ),
                barn
            ),
        },
    };
};
