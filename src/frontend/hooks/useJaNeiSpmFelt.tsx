import React, { ReactNode, useState } from 'react';

import { guid } from 'nav-frontend-js-utils';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ok, useFelt, Valideringsstatus } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/spørsmål';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FeltGruppe {
    hovedSpørsmål: Felt<any>;
    tilhørendeFelter?: Felt<any>[];
}

export const erRelevanteAvhengigheterValidert = (avhengigheter: { [key: string]: FeltGruppe }) => {
    if (
        Object.values(avhengigheter).find(
            feltGruppe =>
                feltGruppe && feltGruppe.hovedSpørsmål.valideringsstatus !== Valideringsstatus.OK
        )
    ) {
        return false;
    }

    const tilhørendeSomIkkeErValidert = Object.values(avhengigheter).filter(feltGruppe => {
        if (!(feltGruppe && feltGruppe.tilhørendeFelter)) {
            return false;
        } else {
            return !!feltGruppe.tilhørendeFelter.find(
                tilhørendeFelt =>
                    tilhørendeFelt.erSynlig &&
                    tilhørendeFelt.valideringsstatus !== Valideringsstatus.OK
            );
        }
    });
    return tilhørendeSomIkkeErValidert.length === 0;
};

const useJaNeiSpmFelt = ({
    søknadsfelt,
    feilmeldingSpråkId,
    avhengigheter,
    nullstillVedAvhengighetEndring = false,
    skalSkjules = false,
    feilmeldingSpråkVerdier,
}: {
    søknadsfelt?: ISøknadSpørsmål<ESvar | null>;
    feilmeldingSpråkId: string;
    avhengigheter?: { [key: string]: FeltGruppe | undefined };
    nullstillVedAvhengighetEndring?: boolean;
    skalSkjules?: boolean;
    feilmeldingSpråkVerdier?: { [key: string]: ReactNode };
}) => {
    const [harBlittVist, settHarBlittVist] = useState<boolean>(!avhengigheter);

    return useFelt<ESvar | null>({
        feltId: søknadsfelt ? søknadsfelt.id : guid(),
        nullstillVedAvhengighetEndring,
        verdi: søknadsfelt?.svar ?? null,
        valideringsfunksjon: (felt: FeltState<ESvar | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst id={feilmeldingSpråkId} values={feilmeldingSpråkVerdier} />
                  );
        },
        skalFeltetVises: (avhengigheter: { [key: string]: FeltGruppe }) => {
            if (avhengigheter && avhengigheter.skalSkjules) return false;
            if (!avhengigheter) return harBlittVist;

            // borPåRegistrertAdresse er et spesialtilfelle for avhengighet, fordi hvis svaret på den er Nei må man søke på papir.
            if (
                avhengigheter.borPåRegistrertAdresse &&
                avhengigheter.borPåRegistrertAdresse.hovedSpørsmål.verdi === ESvar.NEI
            ) {
                return false;
            }

            if (harBlittVist) {
                return true;
            }

            const skalVises = erRelevanteAvhengigheterValidert(avhengigheter);
            skalVises && settHarBlittVist(true);

            return skalVises;
        },
        avhengigheter: { ...avhengigheter, skalSkjules },
    });
};

export default useJaNeiSpmFelt;
