import React, { FC } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { useSpråk } from '../../../context/SpråkContext';
import { LocaleType } from '../../../typer/common';

interface IFeilsideStatuskodeProps {
    statuskode: string;
}

export const FeilsideStatuskode: FC<IFeilsideStatuskodeProps> = ({ statuskode }) => {
    const { valgtLocale } = useSpråk();

    const statuskodeTekstMap: Record<LocaleType, string> = {
        [LocaleType.nb]: 'Statuskode',
        [LocaleType.nn]: 'Statuskode',
        [LocaleType.en]: 'Errorcode',
    };

    const statuskodeTekst = statuskodeTekstMap[valgtLocale];
    const fullStatuskodeTekst = `${statuskodeTekst} ${statuskode}`;

    return (
        <BodyShort textColor="subtle" size="small">
            {fullStatuskodeTekst}
        </BodyShort>
    );
};
