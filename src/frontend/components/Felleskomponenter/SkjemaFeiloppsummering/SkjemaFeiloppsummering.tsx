import React from 'react';

import { ErrorSummary } from '@navikt/ds-react';
import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { SkjemaFeltTyper } from '../../../typer/skjema';

interface Props {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    id?: string;
}

export const SkjemaFeiloppsummering: React.FC<Props> = ({ skjema, id }) => {
    const { tekster, plainTekst } = useApp();
    return (
        <ErrorSummary
            id={id}
            heading={plainTekst(tekster().FELLES.navigasjon.duMaaRetteOppFoelgende)}
        >
            {Object.values(skjema.felter)
                .filter(felt => {
                    return felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL;
                })
                .map(felt => (
                    <ErrorSummary.Item href={'#' + felt.id}>{felt.feilmelding}</ErrorSummary.Item>
                ))}
        </ErrorSummary>
    );
};
