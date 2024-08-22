import React, { FC } from 'react';

import { Heading } from '@navikt/ds-react';

import { useSpråk } from '../../../context/SpråkContext';
import { LocaleType } from '../../../typer/common';

export const FeilsideHeading: FC = () => {
    const { valgtLocale } = useSpråk();

    const tekstMap: Record<LocaleType, string> = {
        [LocaleType.nb]: 'Beklager, noe gikk galt.',
        [LocaleType.nn]: 'Beklager, noe gikk galt.',
        [LocaleType.en]: 'Something went wrong',
    };

    return (
        <Heading level="1" size="large" spacing>
            {tekstMap[valgtLocale]}
        </Heading>
    );
};
