import React from 'react';

import styled from 'styled-components';

import { Radio, RadioGroup } from '@navikt/ds-react';
import type { ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import { OmBarnetSpørsmålsId } from './spørsmål';

const StyledRadioGroup = styled(RadioGroup)`
    && label:not(:last-child) {
        margin-bottom: 1rem;
    }
`;

const SammeSomAnnetBarnRadio: React.FC<{
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
    barnetsNavn: string;
}> = ({ andreBarnSomErFyltUt, skjema, barnetsNavn }) => {
    const felt = skjema.felter.sammeForelderSomAnnetBarn;
    const { tekster } = useAppContext();
    const teksterForSteg = tekster()[ESanitySteg.OM_BARNET];

    const radios = andreBarnSomErFyltUt
        .map(barn => ({
            label: (
                <TekstBlock
                    block={teksterForSteg.svaralternativSammeSomAnnenForelder}
                    flettefelter={{ barnetsNavn: barn.navn }}
                />
            ),
            value: barn.id,
        }))
        .concat({
            label: <TekstBlock block={teksterForSteg.svaralternativAnnenForelder} />,
            value: AlternativtSvarForInput.ANNEN_FORELDER,
        });

    return (
        <StyledRadioGroup
            {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
            legend={
                <TekstBlock block={teksterForSteg.hvemErBarnSinAndreForelder.sporsmal} flettefelter={{ barnetsNavn }} />
            }
            name={OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn}
            onChange={value => {
                felt.onChange(value);
            }}
            error={felt.feilmelding}
            size={'medium'}
        >
            {radios.map(radio => (
                <Radio key={radio.value} value={radio.value}>
                    {radio.label}
                </Radio>
            ))}
        </StyledRadioGroup>
    );
};

export default SammeSomAnnetBarnRadio;
