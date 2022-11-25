import React, { ReactNode, useEffect, useState } from 'react';

import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { AlternativtSvarForInput } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { logSpørsmålBesvart } from '../../../utils/amplitude';
import TekstBlock from '../TekstBlock';

interface IJaNeiSpmProps {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    felt: Felt<ESvar | null>;
    tilleggsinfo?: ReactNode;
    inkluderVetIkke?: boolean;
    spørsmålDokument: ISanitySpørsmålDokument;
    flettefelter?: FlettefeltVerdier;
}

const TilleggsinfoWrapper = styled.div`
    margin-top: 0.5rem;
`;

const JaNeiSpm: React.FC<IJaNeiSpmProps> = ({
    skjema,
    felt,
    tilleggsinfo,
    inkluderVetIkke = false,
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
                    <>
                        <TekstBlock block={spørsmålDokument.sporsmal} flettefelter={flettefelter} />
                        {tilleggsinfo && <TilleggsinfoWrapper>{tilleggsinfo}</TilleggsinfoWrapper>}
                    </>
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
