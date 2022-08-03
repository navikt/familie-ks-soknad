import React from 'react';

import dayjs from 'dayjs';

import { ISODateString } from '@navikt/familie-form-elements';
import { feil, FeltState, ok } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { AlternativtSvarForInput } from '../typer/common';

export const erDatoFormatGodkjent = (verdi: string) => {
    /*FamilieDatoVelger har allerede sin egen validering.
      Dersom valideringen går igjennom der, blir datoen formatert til YYYY-MM-DD.
      Derfor sjekker vi her om FamilieDatoVelger har klart å formatere den,
      i tillegg til om det er en gyldig dato med dayjs.*/
    return dayjs(verdi, 'YYYY-MM-DD').format('YYYY-MM-DD') === verdi;
};

export const erDatoFremITid = (dato: ISODateString) => {
    return dayjs(dato).isAfter(dayjs());
};

export const erDatoEtterSluttdatoAvgresning = (dato: ISODateString, sluttdato: ISODateString) => {
    return dayjs(dato).isAfter(dayjs(sluttdato));
};

export const erDatoFørStartDatoAvgrensning = (dato: ISODateString, startdato: ISODateString) => {
    return dayjs(dato).isBefore(dayjs(startdato));
};

export const gårsdagensDato = () => dayjs().subtract(1, 'day').format('YYYY-MM-DD');

export const ettÅrTilbakeDato = () => dayjs().subtract(1, 'year').format('YYYY-MM-DD');

export const dagensDato = () => dayjs().format('YYYY-MM-DD');

export const morgendagensDato = () => dayjs().add(1, 'day').format('YYYY-MM-DD');

export const erSammeDatoSomDagensDato = (dato: ISODateString) => dayjs(dato).isSame(dayjs(), 'day');

export const dagenEtterDato = (dato: ISODateString) =>
    dayjs(dato).add(1, 'day').format('YYYY-MM-DD');

export const validerDato = (
    feltState: FeltState<string>,
    feilmeldingSpråkId: string,
    startdatoAvgrensning = '',
    sluttdatoAvgrensning = '',
    customStartdatoFeilmelding = ''
): FeltState<string> => {
    if (feltState.verdi === '') {
        return feil(feltState, feilmeldingSpråkId ? <SpråkTekst id={feilmeldingSpråkId} /> : '');
    }
    if (!erDatoFormatGodkjent(feltState.verdi)) {
        return feil(feltState, <SpråkTekst id={'felles.dato-format.feilmelding'} />);
    }
    if (
        !!sluttdatoAvgrensning &&
        erDatoEtterSluttdatoAvgresning(feltState.verdi, sluttdatoAvgrensning)
    ) {
        return feil(
            feltState,
            <SpråkTekst
                id={
                    sluttdatoAvgrensning === dagensDato()
                        ? 'felles.dato-frem-i-tid.feilmelding'
                        : 'felles.dato-frem-i-tid-eller-i-idag.feilmelding'
                }
            />
        );
    }
    if (
        !!startdatoAvgrensning &&
        erDatoFørStartDatoAvgrensning(feltState.verdi, startdatoAvgrensning)
    ) {
        return feil(
            feltState,
            <SpråkTekst
                id={
                    customStartdatoFeilmelding
                        ? customStartdatoFeilmelding
                        : 'felles.tilogmedfeilformat.feilmelding'
                }
            />
        );
    }
    return ok(feltState);
};

export const formaterDato = (isoDateString: ISODateString) =>
    isoDateString === AlternativtSvarForInput.UKJENT
        ? isoDateString
        : dayjs(isoDateString).format('DD.MM.YYYY');
