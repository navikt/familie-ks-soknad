import React from 'react';

import { ErrorSummary } from '@navikt/ds-react';
import { type ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { ISteg } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { AppLenke } from '../AppLenke/AppLenke';

interface Props {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    stegMedFeil?: ISteg;
    id?: string;
}

export const SkjemaFeiloppsummering: React.FC<Props> = ({ skjema, stegMedFeil, id }) => {
    const { tekster, plainTekst } = useAppContext();
    return (
        <ErrorSummary id={id} heading={plainTekst(tekster().FELLES.navigasjon.duMaaRetteOppFoelgende)}>
            {Object.values(skjema.felter)
                .filter(felt => {
                    return felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL;
                })
                .map(felt =>
                    stegMedFeil ? (
                        <AppLenke steg={stegMedFeil} hash={felt.id} key={`feil-${stegMedFeil}`}>
                            {felt.feilmelding}
                        </AppLenke>
                    ) : (
                        <ErrorSummary.Item href={'#' + felt.id} key={`feil-${felt.id}`}>
                            {felt.feilmelding}
                        </ErrorSummary.Item>
                    )
                )}
        </ErrorSummary>
    );
};
