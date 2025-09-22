import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput, LocaleRecordBlock, LocaleRecordString, LocaleType } from '../../typer/common';
import { FlettefeltVerdier, ISøknadsfelt, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';

export const søknadsfeltHof =
    (tilRestLocaleRecord: TilRestLocaleRecord) =>
    <T>(
        labelLocaleRecord: LocaleRecordString | LocaleRecordBlock | undefined,
        svar: Record<LocaleType, T>,
        flettefelter?: FlettefeltVerdier
    ): ISøknadsfelt<T> => {
        if (!labelLocaleRecord) {
            throw Error('Mangler tekst fra Sanity som burde vært implementert');
        }
        return { label: tilRestLocaleRecord(labelLocaleRecord, flettefelter), verdi: svar };
    };

export const søknadsfeltForESvarHof =
    (tilRestLocaleRecord: TilRestLocaleRecord) =>
    (spørsmål: LocaleRecordBlock, svar: ESvar | null, flettefelter?: FlettefeltVerdier): ISøknadsfelt<ESvar> => {
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

export const verdiCallbackAlleSpråk = <T>(cb: (locale: LocaleType) => T): Record<LocaleType, T> => ({
    [LocaleType.nb]: cb(LocaleType.nb),
    [LocaleType.nn]: cb(LocaleType.nn),
    [LocaleType.en]: cb(LocaleType.en),
});

export const sammeVerdiAlleSpråk = <T>(verdi: T): Record<LocaleType, T> => verdiCallbackAlleSpråk(() => verdi);

export const sammeVerdiAlleSpråkEllerUkjent = <T>(
    tilRestLocaleRecord: TilRestLocaleRecord,
    svar: T | AlternativtSvarForInput,
    checkboxLabel?: LocaleRecordBlock,
    flettefelter?: FlettefeltVerdier
): Record<LocaleType, T | string> =>
    checkboxLabel && svar === AlternativtSvarForInput.UKJENT
        ? tilRestLocaleRecord(checkboxLabel, flettefelter)
        : sammeVerdiAlleSpråk(svar);
