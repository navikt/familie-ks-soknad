import React, { ReactNode } from 'react';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button, FormSummary } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { LocaleRecordBlock } from '../../../typer/common';
import TekstBlock from '../TekstBlock';

interface Props {
    fjernPeriodeCallback?: () => void;
    fjernKnappTekst: LocaleRecordBlock;
    tittel: ReactNode;
    children?: ReactNode;
}

function PeriodeOppsummering({ fjernPeriodeCallback = undefined, fjernKnappTekst, tittel, children }: Props) {
    const { plainTekst } = useAppContext();

    return (
        <FormSummary.Answer>
            <FormSummary.Label>{tittel}</FormSummary.Label>
            <FormSummary.Value>
                <FormSummary.Answers>
                    {children}
                    {fjernPeriodeCallback && fjernKnappTekst && (
                        <FormSummary.Answer>
                            <FormSummary.Label hidden>{plainTekst(fjernKnappTekst)}</FormSummary.Label>
                            <FormSummary.Value>
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    onClick={fjernPeriodeCallback}
                                    icon={<TrashFillIcon aria-hidden />}
                                >
                                    <TekstBlock block={fjernKnappTekst} />
                                </Button>
                            </FormSummary.Value>
                        </FormSummary.Answer>
                    )}
                </FormSummary.Answers>
            </FormSummary.Value>
        </FormSummary.Answer>
    );
}

export default PeriodeOppsummering;
