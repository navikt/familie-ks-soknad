import React, { Dispatch, SetStateAction, useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, ISkjema, ok, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import useInputFelt from '../../../../hooks/useInputFelt';
import useJaNeiSpmFelt from '../../../../hooks/useJaNeiSpmFelt';
import { usePerioder } from '../../../../hooks/usePerioder';
import { AlternativtSvarForInput } from '../../../../typer/common';
import { IArbeidsperiode, IPensjonsperiode, IUtbetalingsperiode } from '../../../../typer/perioder';
import { ISøker } from '../../../../typer/person';
import { IEøsForSøkerFeltTyper } from '../../../../typer/skjema';
import { valideringAdresse } from '../../../../utils/adresse';
import { trimWhiteSpace } from '../../../../utils/hjelpefunksjoner';
import { arbeidsperiodeFeilmelding } from '../../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { pensjonsperiodeFeilmelding } from '../../../Felleskomponenter/Pensjonsmodal/språkUtils';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { idNummerKeyPrefix } from '../idnummerUtils';
import { EøsSøkerSpørsmålId } from './spørsmål';

export const useEøsForSøker = (): {
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    validerAlleSynligeFelter: () => void;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    leggTilAndreUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    fjernAndreUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    idNummerFelter: Felt<string>[];
} => {
    const { søknad, settSøknad } = useApp();

    const [idNummerFelter, settIdNummerFelter] = useState<Felt<string>[]>([]);

    const søker = søknad.søker;

    const adresseISøkeperiode = useInputFelt({
        søknadsfelt: {
            id: EøsSøkerSpørsmålId.adresseISøkeperiode,
            svar: søker.adresseISøkeperiode.svar,
        },
        feilmeldingSpråkId: 'eøs-om-deg.dittoppholdssted.feilmelding',
        skalVises: søker.triggetEøs,
        customValidering: valideringAdresse,
    });

    const arbeidINorge = useJaNeiSpmFelt({
        søknadsfelt: søker.arbeidINorge,
        feilmeldingSpråkId: 'eøs-om-deg.arbeidsperioderinorge.feilmelding',
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: registrerteArbeidsperioder,
    } = usePerioder<IArbeidsperiode>(
        søker.arbeidsperioderNorge,
        { arbeidINorge },
        avhengigheter => avhengigheter.arbeidINorge.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.arbeidINorge.verdi === ESvar.NEI ||
                (avhengigheter?.arbeidINorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(false)} />);
        }
    );

    const pensjonNorge = useJaNeiSpmFelt({
        søknadsfelt: søker.pensjonNorge,
        feilmeldingSpråkId: 'eøs-om-deg.pensjoninorge.feilmelding',
    });
    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: registrertePensjonsperioder,
    } = usePerioder<IPensjonsperiode>(
        søker.pensjonsperioderNorge,
        { pensjonNorge },
        avhengigheter => avhengigheter.pensjonNorge.verdi === ESvar.JA,

        (felt, avhengigheter) => {
            return avhengigheter?.pensjonNorge.verdi === ESvar.NEI ||
                (avhengigheter?.pensjonNorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={pensjonsperiodeFeilmelding(false)} />);
        }
    );

    const andreUtbetalinger = useJaNeiSpmFelt({
        søknadsfelt: søker.andreUtbetalinger,
        feilmeldingSpråkId: 'eøs-om-deg.utbetalinger.feilmelding',
    });
    const {
        fjernPeriode: fjernAndreUtbetalingsperiode,
        leggTilPeriode: leggTilAndreUtbetalingsperiode,
        registrertePerioder: registrerteAndreUtbetalinger,
    } = usePerioder<IUtbetalingsperiode>(
        søker.andreUtbetalingsperioder,
        { andreUtbetalinger },
        avhengigheter => avhengigheter.andreUtbetalinger.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreUtbetalinger.verdi === ESvar.NEI ||
                (avhengigheter?.andreUtbetalinger.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.flereytelser.feilmelding'} />);
        }
    );

    const oppdaterSøknad = () => {
        const oppdatertSøker = genererOppdatertSøker();
        settSøknad({
            ...søknad,
            søker: oppdatertSøker,
        });
    };
    const genererOppdatertSøker = (): ISøker => ({
        ...søknad.søker,
        idNummer: idNummerFelter.map(felt => ({
            land: felt.id.split(idNummerKeyPrefix)[1] as Alpha3Code,
            idnummer:
                trimWhiteSpace(felt.verdi) === '' ? AlternativtSvarForInput.UKJENT : felt.verdi,
        })),
        adresseISøkeperiode: {
            ...søknad.søker.adresseISøkeperiode,
            svar: trimWhiteSpace(skjema.felter.adresseISøkeperiode.verdi),
        },
        arbeidINorge: {
            ...søknad.søker.arbeidINorge,
            svar: skjema.felter.arbeidINorge.verdi,
        },

        arbeidsperioderNorge:
            skjema.felter.arbeidINorge.verdi === ESvar.JA
                ? skjema.felter.registrerteArbeidsperioder.verdi
                : [],

        pensjonNorge: {
            ...søknad.søker.pensjonNorge,
            svar: skjema.felter.pensjonNorge.verdi,
        },
        pensjonsperioderNorge:
            skjema.felter.pensjonNorge.verdi === ESvar.JA
                ? skjema.felter.registrertePensjonsperioder.verdi
                : [],
        andreUtbetalinger: {
            ...søknad.søker.andreUtbetalinger,
            svar: skjema.felter.andreUtbetalinger.verdi,
        },
        andreUtbetalingsperioder:
            skjema.felter.andreUtbetalinger.verdi === ESvar.JA
                ? skjema.felter.registrerteAndreUtbetalinger.verdi
                : [],
    });

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IEøsForSøkerFeltTyper,
        string
    >({
        felter: {
            ...idNummerFelter.reduce(
                (objekt, felt) => ({
                    ...objekt,
                    [felt.id]: felt,
                }),
                {}
            ),
            adresseISøkeperiode,
            arbeidINorge,
            registrerteArbeidsperioder,
            pensjonNorge,
            registrertePensjonsperioder,
            andreUtbetalinger,
            registrerteAndreUtbetalinger,
        },
        skjemanavn: 'eøsForSøker',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        validerAlleSynligeFelter,
        oppdaterSøknad,
        fjernArbeidsperiode,
        leggTilArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilAndreUtbetalingsperiode,
        fjernAndreUtbetalingsperiode,
        settIdNummerFelter,
        idNummerFelter,
    };
};
