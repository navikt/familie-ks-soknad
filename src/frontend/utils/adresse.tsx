import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { feil, FeltState, ok } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { IAdresse } from '../typer/kontrakt/generelle';
import { ISøker } from '../typer/person';
import { trimWhiteSpace } from './hjelpefunksjoner';
import { uppercaseFørsteBokstav } from './visning';

export const erNorskPostnummer = (verdi: string) =>
    !!(verdi?.length === 4 && Number.parseInt(verdi));

export const hentAdressefelterSortert = (adresse: IAdresse): string[] => {
    return [
        `${adresse.adressenavn ?? ''} ${adresse.husnummer ?? ''}${adresse.husbokstav ?? ''} ${
            adresse.bruksenhetsnummer ?? ''
        }`,
        `${adresse.postnummer ?? ''} ${
            adresse.poststed ? uppercaseFørsteBokstav(adresse.poststed) : ''
        }`,
    ]
        .map(linje => linje.replace(/\s{2+}/, ' ').trim())
        .filter(value => value);
};

export const genererAdresseVisning = (søker: ISøker) => {
    if (søker.adresse) {
        return hentAdressefelterSortert(søker.adresse).map((adresseFelt, index) => (
            <Normaltekst key={index}>{adresseFelt}</Normaltekst>
        ));
    }

    return (
        <Normaltekst>
            <SpråkTekst
                id={
                    søker.adressebeskyttelse
                        ? 'omdeg.personopplysninger.adressesperre.alert'
                        : 'omdeg.personopplysninger.ikke-registrert.alert'
                }
            />
        </Normaltekst>
    );
};

export const valideringAdresse = (felt: FeltState<string>) => {
    const verdi = trimWhiteSpace(felt.verdi);
    return verdi.length < 100
        ? ok(felt)
        : feil(felt, <SpråkTekst id={'felles.fulladresse.format.feilmelding'} />);
};
