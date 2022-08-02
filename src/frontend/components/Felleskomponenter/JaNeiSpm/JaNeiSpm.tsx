import React, { ReactNode, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { guid } from 'nav-frontend-js-utils';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { AlternativtSvarForInput } from '../../../typer/common';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { logSpørsmålBesvart } from '../../../utils/amplitude';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface IJaNeiSpmProps {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    felt: Felt<ESvar | null>;
    spørsmålTekstId: string;
    tilleggsinfoTekstId?: string;
    tilleggsinfo?: ReactNode;
    inkluderVetIkke?: boolean;
    språkValues?: Record<string, ReactNode> | undefined;
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
}) => {
    const ref = useRef<RadioPanelGruppe>(null);
    const [mounted, settMounted] = useState(false);

    useEffect(() => {
        const jaNeiRef = ref.current;
        if (mounted && jaNeiRef) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jaNeiRef.props.onChange(null, felt.verdi);
            logSpørsmålBesvart(spørsmålTekstId, felt.verdi ?? AlternativtSvarForInput.UKJENT);
        }
        settMounted(true);
    }, [felt.verdi]);

    return felt.erSynlig ? (
        <span id={felt.id}>
            <JaNeiSpørsmål
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                initiellVerdi={felt.verdi}
                name={guid()}
                ref={ref}
                legend={
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
                }
                labelTekstForRadios={{
                    ja: <SpråkTekst id={'felles.svaralternativ.ja'} />,
                    nei: <SpråkTekst id={'felles.svaralternativ.nei'} />,
                    vetikke: inkluderVetIkke ? (
                        <SpråkTekst id={'felles.svaralternativ.vetikke'} />
                    ) : undefined,
                }}
            />
        </span>
    ) : null;
};

export default JaNeiSpm;
