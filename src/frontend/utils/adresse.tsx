import React from 'react';

import { BodyShort } from '@navikt/ds-react';
import { feil, type FeltState, ok } from '@navikt/familie-skjema';

import { IOmDegTekstinnhold } from '../components/SøknadsSteg/OmDeg/innholdTyper';
import { IAdresse, PlainTekst } from '../typer/kontrakt/generelle';
import { ISøker } from '../typer/person';

import { trimWhiteSpace } from './hjelpefunksjoner';
import { uppercaseKunFørsteBokstav } from './visning';

export const erNorskPostnummer = (verdi: string) => !!(verdi?.length === 4 && Number.parseInt(verdi));

export const hentAdressefelterSortert = (adresse: IAdresse): string[] => {
    return [
        `${adresse.adressenavn ?? ''} ${adresse.husnummer ?? ''}${adresse.husbokstav ?? ''} ${
            adresse.bruksenhetsnummer ?? ''
        }`,
        `${adresse.postnummer ?? ''} ${adresse.poststed ? uppercaseKunFørsteBokstav(adresse.poststed) : ''}`,
    ]
        .map(linje => linje.replace(/\s{2+}/, ' ').trim())
        .filter(value => value);
};

export const genererAdresseVisning = (søker: ISøker, tekster: IOmDegTekstinnhold, plainTekst: PlainTekst) => {
    if (søker.adresse) {
        return hentAdressefelterSortert(søker.adresse).map((adresseFelt, index) => (
            <BodyShort key={index}>{adresseFelt}</BodyShort>
        ));
    }

    return (
        <BodyShort>
            {plainTekst(søker.adressebeskyttelse ? tekster.soekerAdressesperre : tekster.ikkeRegistrertAdresse)}
        </BodyShort>
    );
};

export const valideringAdresse = (felt: FeltState<string>, feilmelding: string) => {
    const verdi = trimWhiteSpace(felt.verdi);
    return verdi.length < 100 ? ok(felt) : feil(felt, feilmelding);
};
