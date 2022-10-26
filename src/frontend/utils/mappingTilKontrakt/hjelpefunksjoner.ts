import { ReactNode } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { IBarnMedISøknad } from '../../typer/barn';
import { AlternativtSvarForInput, LocaleRecordBlock, LocaleRecordString } from '../../typer/common';
import {
    FlettefeltVerdier,
    ISøknadsfelt,
    Slektsforhold,
    SpørsmålMap as KontraktpørsmålMap,
    TilRestLocaleRecord,
} from '../../typer/kontrakt/generelle';
import { ISøknadSpørsmål, SpørsmålId, ISøknadSpørsmålMap } from '../../typer/spørsmål';
import { hentTekster, landkodeTilSpråk, toSlektsforholdSpråkId } from '../språk';
import { språkIndexListe } from '../spørsmål';
import { isAlpha3Code } from '../typeguards';

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

export const verdiCallbackAlleSpråk = <T>(
    cb: (locale: LocaleType) => T
): Record<LocaleType, T> => ({
    [LocaleType.nb]: cb(LocaleType.nb),
    [LocaleType.nn]: cb(LocaleType.nn),
    [LocaleType.en]: cb(LocaleType.en),
});

export const sammeVerdiAlleSpråk = <T>(verdi: T): Record<LocaleType, T> =>
    verdiCallbackAlleSpråk(() => verdi);

export const sammeVerdiAlleSpråkEllerUkjentSpråktekst = <T>(
    svar: T | AlternativtSvarForInput,
    ukjentTekstid: string,
    språkVerdier: Record<string, ReactNode> = {}
): Record<LocaleType, T | string> =>
    svar === AlternativtSvarForInput.UKJENT
        ? hentTekster(ukjentTekstid, språkVerdier)
        : sammeVerdiAlleSpråk(svar);

export const spørmålISøknadsFormat = (
    spørsmålMap: ISøknadSpørsmålMap,
    formatMessageValues: object = {}
): KontraktpørsmålMap => {
    return Object.fromEntries(
        Object.entries(spørsmålMap)
            .map(
                (
                    entry: [string, ISøknadSpørsmål<any>]
                ): [
                    string,
                    { label: Record<LocaleType, string>; verdi: Record<LocaleType, any> }
                ] => {
                    const verdi = entry[1].svar;
                    let formatertVerdi: Record<LocaleType, string>;

                    if (isAlpha3Code(verdi)) {
                        formatertVerdi = verdiCallbackAlleSpråk(locale =>
                            landkodeTilSpråk(verdi, locale)
                        );
                    } else if (verdi in ESvar) {
                        // Slår opp språktekst i språkteksterUtenomSpørsmål i dokgen
                        formatertVerdi = sammeVerdiAlleSpråk(verdi);
                    } else if (verdi in Slektsforhold) {
                        formatertVerdi = hentTekster(toSlektsforholdSpråkId(verdi));
                    } else {
                        formatertVerdi = sammeVerdiAlleSpråk(verdi);
                    }

                    return [
                        entry[0],
                        søknadsfeltGammel(
                            språktekstIdFraSpørsmålId(entry[1].id),
                            formatertVerdi,
                            formatMessageValues
                        ),
                    ];
                }
            )
            .filter(entry => entry[1].verdi[LocaleType.nb])
    );
};

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
