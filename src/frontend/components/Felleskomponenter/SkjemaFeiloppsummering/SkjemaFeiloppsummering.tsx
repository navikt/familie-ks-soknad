import React from 'react';

import { ErrorSummary } from '@navikt/ds-react';
import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { ISteg } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { AppLenke } from '../AppLenke/AppLenke';

interface Props {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    overstyrMedLenkeTilSteg?: ISteg;
    id?: string;
}

export const SkjemaFeiloppsummering: React.FC<Props> = ({
    skjema,
    overstyrMedLenkeTilSteg,
    id,
}) => {
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
                .map(felt =>
                    overstyrMedLenkeTilSteg ? (
                        <AppLenke steg={overstyrMedLenkeTilSteg}>{felt.feilmelding}</AppLenke>
                    ) : (
                        <ErrorSummary.Item href={'#' + felt.id}>
                            {felt.feilmelding}
                        </ErrorSummary.Item>
                    )
                )}
        </ErrorSummary>
    );
};
