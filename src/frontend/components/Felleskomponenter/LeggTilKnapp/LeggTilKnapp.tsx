import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Box, Button, ErrorMessage, FormSummary } from '@navikt/ds-react';

import styles from './LeggTilKnapp.module.css';

interface Props {
    onClick: () => void | Promise<void>;
    leggTilFlereTekst: ReactNode;
    feilmelding: ReactNode;
    id?: string;
    children?: ReactNode;
}

export function LeggTilKnapp({ onClick, leggTilFlereTekst, feilmelding, id, children }: Props) {
    return (
        <FormSummary.Answer>
            <FormSummary.Label>{leggTilFlereTekst}</FormSummary.Label>
            <FormSummary.Value>
                <Button
                    id={id}
                    className={classNames({ [styles.buttonError]: !!feilmelding })}
                    variant="tertiary"
                    type="button"
                    onClick={onClick}
                    icon={<PlusCircleIcon aria-hidden />}
                >
                    {children}
                </Button>
                {!!feilmelding && (
                    <Box marginBlock="space-8 space-0">
                        <ErrorMessage showIcon>{feilmelding}</ErrorMessage>
                    </Box>
                )}
            </FormSummary.Value>
        </FormSummary.Answer>
    );
}
