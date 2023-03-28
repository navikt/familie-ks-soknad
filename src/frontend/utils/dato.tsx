import {
    add,
    format,
    isAfter,
    isBefore,
    isFuture,
    isToday,
    isValid,
    parse,
    startOfDay,
    startOfToday,
    sub,
} from 'date-fns';

import { feil, FeltState, ok } from '@navikt/familie-skjema';

import {
    AlternativtSvarForInput,
    DatoMedUkjent,
    ISODateString,
    LocaleRecordBlock,
} from '../typer/common';
import { PlainTekst } from '../typer/kontrakt/generelle';
import { IFormateringsfeilmeldingerTekstinnhold } from '../typer/sanity/tekstInnhold';

export const erDatoFormatGodkjent = (dato: Date) => isValid(dato);

export const erDatoFremITid = (dato: Date) => isFuture(dato);

export const erDatoEtterSluttdatoAvgresning = (dato: Date, sluttdato: Date) =>
    isAfter(dato, sluttdato);

export const erDatoFørStartDatoAvgrensning = (dato: Date, startdato: Date) =>
    isBefore(dato, startdato);

export const gårsdagensDato = () => sub(dagensDato(), { days: 1 });

export const ettÅrTilbakeDato = () => sub(dagensDato(), { years: 1 });

export const dagensDato = () => startOfToday();

export const morgendagensDato = () => add(dagensDato(), { days: 1 });

export const erSammeDatoSomDagensDato = (dato: Date) => isToday(dato);

export const dagenEtterDato = (dato: Date) => add(dato, { days: 1 });

export const tidenesMorgen = () => startOfDay(new Date(1000, 0));

export const tidenesEnde = () => startOfDay(new Date(3000, 0));

export const stringTilDate = (dato: string) => startOfDay(new Date(dato));

export const parseTilGyldigDato = (dateString: string, format: string): Date | undefined => {
    const parsetDato = parse(dateString, format, new Date());
    const parsetDatoErGyldig = erDatoFormatGodkjent(parsetDato);
    return parsetDatoErGyldig ? parsetDato : undefined;
};

export const validerDato = (
    tekster: IFormateringsfeilmeldingerTekstinnhold,
    plainTekst: PlainTekst,
    feltState: FeltState<string>,
    feilmelding: LocaleRecordBlock | undefined,
    startdatoAvgrensning: Date | undefined = undefined,
    sluttdatoAvgrensning: Date | undefined = undefined,
    customStartdatoFeilmelding = ''
): FeltState<string> => {
    if (feltState.verdi === '') {
        return feil(feltState, plainTekst(feilmelding) ?? '');
    }

    const dato = parseTilGyldigDato(feltState.verdi, 'yyyy-MM-dd');

    if (!dato) {
        return feil(feltState, plainTekst(tekster.ugyldigDato));
    }
    if (!!sluttdatoAvgrensning && erDatoEtterSluttdatoAvgresning(dato, sluttdatoAvgrensning)) {
        return feil(
            feltState,
            plainTekst(
                sluttdatoAvgrensning === dagensDato()
                    ? tekster.datoKanIkkeVaereFremITid
                    : tekster.datoKanIkkeVaereDagensDatoEllerFremITid
            )
        );
    }

    if (!!startdatoAvgrensning && erDatoFørStartDatoAvgrensning(dato, startdatoAvgrensning)) {
        return feil(
            feltState,
            customStartdatoFeilmelding
                ? customStartdatoFeilmelding
                : plainTekst(tekster.periodeAvsluttesForTidlig)
        );
    }
    return ok(feltState);
};

export const formaterDato = (datoString: ISODateString) =>
    format(new Date(datoString), 'dd.MM.yyyy');

export const formaterDatoMedUkjent = (datoMedUkjent: DatoMedUkjent, tekstForUkjent): string => {
    return datoMedUkjent === AlternativtSvarForInput.UKJENT
        ? tekstForUkjent
        : format(new Date(datoMedUkjent), 'dd.MM.yyyy');
};
