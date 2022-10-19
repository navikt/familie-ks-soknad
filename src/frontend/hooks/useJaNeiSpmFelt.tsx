import React, { ReactNode, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ok, useFelt, Valideringsstatus } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import TekstBlock from '../components/Felleskomponenter/TekstBlock';
import { LocaleRecordBlock } from '../typer/common';
import { FlettefeltVerdier } from '../typer/kontrakt/generelle';
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
    feilmelding,
    avhengigheter,
    nullstillVedAvhengighetEndring = false,
    skalSkjules = false,
    feilmeldingSpråkVerdier,
    flettefelter,
}: {
    søknadsfelt?: ISøknadSpørsmål<ESvar | null>;
    /** @deprecated **/
    feilmeldingSpråkId?: string;
    feilmelding?: LocaleRecordBlock; // todo: fjern optional når vi fjerner deprecated felt
    avhengigheter?: Record<string, FeltGruppe | undefined>;
    nullstillVedAvhengighetEndring?: boolean;
    skalSkjules?: boolean;
    /** @deprecated **/
    feilmeldingSpråkVerdier?: Record<string, ReactNode>;
    flettefelter?: FlettefeltVerdier;
}) => {
    const [harBlittVist, settHarBlittVist] = useState<boolean>(!avhengigheter);

    return useFelt<ESvar | null>({
        feltId: søknadsfelt ? søknadsfelt.id : uuidv4(),
        nullstillVedAvhengighetEndring,
        verdi: søknadsfelt?.svar ?? null,
        valideringsfunksjon: (felt: FeltState<ESvar | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(
                      felt,
                      feilmelding ? (
                          <TekstBlock block={feilmelding} flettefelter={flettefelter} />
                      ) : (
                          <SpråkTekst id={feilmeldingSpråkId} values={feilmeldingSpråkVerdier} />
                      )
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
