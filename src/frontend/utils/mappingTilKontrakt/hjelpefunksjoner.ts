import { ReactNode } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { IBarnMedISøknad } from '../../typer/barn';
import { AlternativtSvarForInput, LocaleRecordBlock, LocaleRecordString } from '../../typer/common';
import {
    FlettefeltVerdier,
    ISøknadsfelt,
    TilRestLocaleRecord,
} from '../../typer/kontrakt/generelle';
import { SpørsmålId } from '../../typer/spørsmål';
import { hentTekster } from '../språk';
import { språkIndexListe } from '../spørsmål';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const søknadsfeltGammel = <T>(
    labelTekstId: string,
    value: Record<LocaleType, T>,
    labelMessageValues: object = {}
): ISøknadsfelt<T> => {
    return { label: hentTekster(labelTekstId, labelMessageValues), verdi: value };
};

export const søknadsfeltHof =
    (tilRestLocaleRecord: TilRestLocaleRecord) =>
    <T>(
        labelLocaleRecord: LocaleRecordString | LocaleRecordBlock,
        svar: Record<LocaleType, T>,
        flettefelter?: FlettefeltVerdier
    ): ISøknadsfelt<T> => {
        return { label: tilRestLocaleRecord(labelLocaleRecord, flettefelter), verdi: svar };
    };

export const søknadsfeltForESvarHof =
    (tilRestLocaleRecord: TilRestLocaleRecord) =>
    (
        spørsmål: LocaleRecordBlock,
        svar: ESvar | null,
        flettefelter?: FlettefeltVerdier
    ): ISøknadsfelt<ESvar> => {
        const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
        if (!svar) {
            throw Error(`Svar for ${spørsmål.nb} kan ikke være null`);
        }
        return søknadsfelt(spørsmål, sammeVerdiAlleSpråk(svar), flettefelter);
    };

export const nullableSøknadsfeltForESvarHof =
    (tilRestLocaleRecord: TilRestLocaleRecord) =>
    (spørsmål: LocaleRecordBlock, svar: ESvar | null, flettefelter?: FlettefeltVerdier) => {
        const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
        return svar ? søknadsfelt(spørsmål, sammeVerdiAlleSpråk(svar), flettefelter) : null;
    };

export const verdiCallbackAlleSpråk = <T>(
    cb: (locale: LocaleType) => T
): Record<LocaleType, T> => ({
    [LocaleType.nb]: cb(LocaleType.nb),
    [LocaleType.nn]: cb(LocaleType.nn),
    [LocaleType.en]: cb(LocaleType.en),
});

export const sammeVerdiAlleSpråk = <T>(verdi: T): Record<LocaleType, T> =>
    verdiCallbackAlleSpråk(() => verdi);

export const sammeVerdiAlleSpråkEllerUkjentSpråktekstGammel = <T>(
    svar: T | AlternativtSvarForInput,
    ukjentTekstid: string,
    språkVerdier: Record<string, ReactNode> = {}
): Record<LocaleType, T | string> =>
    svar === AlternativtSvarForInput.UKJENT
        ? hentTekster(ukjentTekstid, språkVerdier)
        : sammeVerdiAlleSpråk(svar);

export const sammeVerdiAlleSpråkEllerUkjent = <T>(
    tilRestLocaleRecord: TilRestLocaleRecord,
    svar: T | AlternativtSvarForInput,
    checkboxLabel?: LocaleRecordString,
    flettefelter?: FlettefeltVerdier
): Record<LocaleType, T | string> =>
    checkboxLabel && svar === AlternativtSvarForInput.UKJENT
        ? tilRestLocaleRecord(checkboxLabel, flettefelter)
        : sammeVerdiAlleSpråk(svar);

export const språktekstIdFraSpørsmålId = (spørsmålId: SpørsmålId): string => {
    for (const språkIndex of språkIndexListe) {
        if (spørsmålId in språkIndex) {
            return språkIndex[spørsmålId];
        }
    }
    return 'ukjent-spørsmål';
};

export const søknadsfeltBarn = <T>(
    labelTekstId: string,
    value: Record<LocaleType, T>,
    barn?: IBarnMedISøknad,
    labelMessageValues: object = {}
): ISøknadsfelt<T> =>
    barn
        ? søknadsfeltGammel(labelTekstId, value, {
              ...labelMessageValues,
              navn: barn.navn,
              barn: barn.navn,
          })
        : søknadsfeltGammel(labelTekstId, value);
