import React from 'react';
import { ReactNode } from 'react';

import { FeiloppsummeringFeil } from 'nav-frontend-skjema';

import { ISteg } from '../../../typer/routes';
import { AppLenke } from '../AppLenke/AppLenke';

export const lagRouteFeilRenderer = (steg: ISteg) => {
    return (feil: FeiloppsummeringFeil): ReactNode => {
        const { feilmelding, skjemaelementId } = feil;
        return (
            <AppLenke steg={steg} hash={skjemaelementId}>
                {feilmelding}
            </AppLenke>
        );
    };
};
