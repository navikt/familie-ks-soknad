import { useEffect } from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../context/AppContext';
import { LocaleRecordBlock } from '../typer/common';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { validerDato } from '../utils/dato';

const useDatovelgerFeltMedJaNeiAvhengighet = ({
    søknadsfelt,
    avhengigSvarCondition,
    avhengighet,
    feilmelding,
    sluttdatoAvgrensning = '',
    startdatoAvgrensning = '',
}: {
    søknadsfelt: ISøknadSpørsmål<ISODateString>;
    avhengigSvarCondition: ESvar;
    avhengighet: Felt<ESvar | null>;
    feilmelding: LocaleRecordBlock;
    sluttdatoAvgrensning?: ISODateString;
    startdatoAvgrensning?: ISODateString;
}) => {
    const { plainTekst } = useApp();
    const skalFeltetVises = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;

    const dato = useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt, avhengigheter) => {
            const startdatoAvgrensning = avhengigheter && avhengigheter.startdatoAvgrensning;
            const sluttdatoAvgrensning = avhengigheter && avhengigheter.sluttdatoAvgrensning;

            return validerDato(
                felt,
                plainTekst(feilmelding),
                startdatoAvgrensning,
                sluttdatoAvgrensning
            );
        },
        skalFeltetVises: avhengigheter => {
            return avhengigheter && (avhengigheter.jaNeiSpm as Felt<ESvar | null>)
                ? skalFeltetVises(avhengigheter.jaNeiSpm.verdi)
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet, sluttdatoAvgrensning, startdatoAvgrensning },
    });

    useEffect(() => {
        const skalVises = skalFeltetVises(avhengighet.verdi);

        skalVises && dato.verdi !== '' && dato.validerOgSettFelt(dato.verdi);

        return () => {
            !skalFeltetVises(avhengighet.verdi) && dato.validerOgSettFelt('');
        };
    }, [avhengighet]);

    return dato;
};

export default useDatovelgerFeltMedJaNeiAvhengighet;
