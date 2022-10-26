import React, { ReactNode, useEffect, useState } from 'react';

import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { AlternativtSvarForInput } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { logSpørsmålBesvart } from '../../../utils/amplitude';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import TekstBlock from '../TekstBlock';

interface IJaNeiSpmProps {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    felt: Felt<ESvar | null>;
    /** @deprecated **/
    spørsmålTekstId?: string; // todo: legacy, fjerne denne når vi går over til sanity
    tilleggsinfoTekstId?: string;
    tilleggsinfo?: ReactNode;
    inkluderVetIkke?: boolean;
    /** @deprecated **/ // todo: legacy, fjerne denne når vi går over til sanity
    språkValues?: Record<string, ReactNode> | undefined;
    spørsmålDokument?: ISanitySpørsmålDokument;
    flettefelter?: FlettefeltVerdier;
}

const TilleggsinfoWrapper = styled.div`
    margin-top: 0.5rem;
`;

const JaNeiSpm: React.FC<IJaNeiSpmProps> = ({
    skjema,
    felt,
    spørsmålTekstId,
    tilleggsinfoTekstId,
    tilleggsinfo,
    inkluderVetIkke = false,
    språkValues,
    spørsmålDokument,
    flettefelter,
}) => {
    const [mounted, settMounted] = useState(false);
    const { tekster, plainTekst } = useApp();
    const { ja, nei, jegVetIkke } = tekster().FELLES.frittståendeOrd;

    useEffect(() => {
        if (mounted) {
            spørsmålDokument &&
                logSpørsmålBesvart(
                    spørsmålDokument.api_navn,
                    felt.verdi ?? AlternativtSvarForInput.UKJENT
                );
        }
        settMounted(true);
    }, [felt.verdi]);

    return felt.erSynlig ? (
        <span id={felt.id} data-testid={felt.id}>
            <JaNeiSpørsmål
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                initiellVerdi={felt.verdi}
                name={uuidv4()}
                size={'medium'}
                error={felt.hentNavInputProps(skjema.visFeilmeldinger).feil}
                legend={
                    spørsmålTekstId ? (
                        <>
                            <Element>
                                <SpråkTekst id={spørsmålTekstId} values={språkValues} />
                            </Element>
                            {tilleggsinfoTekstId && (
                                <Normaltekst>
                                    <SpråkTekst id={tilleggsinfoTekstId} />
                                </Normaltekst>
                            )}
                            <TilleggsinfoWrapper>{tilleggsinfo}</TilleggsinfoWrapper>
                        </>
                    ) : spørsmålDokument ? (
                        <>
                            <TekstBlock
                                block={spørsmålDokument.sporsmal}
                                flettefelter={flettefelter}
                            />
                            {tilleggsinfo && (
                                <TilleggsinfoWrapper>{tilleggsinfo}</TilleggsinfoWrapper>
                            )}
                        </>
                    ) : null
                }
                labelTekstForRadios={{
                    ja: plainTekst(ja),
                    nei: plainTekst(nei),
                    vetikke: inkluderVetIkke ? plainTekst(jegVetIkke) : undefined,
                }}
            />
        </span>
    ) : null;
};

export default JaNeiSpm;
