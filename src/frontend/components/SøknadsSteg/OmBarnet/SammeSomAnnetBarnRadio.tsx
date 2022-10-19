import React from 'react';

import styled from 'styled-components';

import { RadioPanelGruppe } from 'nav-frontend-skjema';

import { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { OmBarnetSpørsmålsId } from './spørsmål';

const StyledRadioPanelGruppe = styled(RadioPanelGruppe)`
    && label:not(:last-child) {
        margin-bottom: 1rem;
    }
`;

const SammeSomAnnetBarnRadio: React.FC<{
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    barnetsNavn: string;
}> = ({ andreBarnSomErFyltUt, skjema, barnetsNavn }) => {
    const felt = skjema.felter.sammeForelderSomAnnetBarn;
    const { tekster } = useApp();
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
        <StyledRadioPanelGruppe
            {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
            legend={
                <TekstBlock
                    block={teksterForSteg.hvemErBarnSinAndreForelder.sporsmal}
                    flettefelter={{ barnetsNavn }}
                />
            }
            checked={felt.verdi ?? undefined}
            name={OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn}
            radios={radios}
            onChange={(_event, value) => {
                felt.onChange(value);
            }}
            feil={felt.feilmelding}
        />
    );
};

export default SammeSomAnnetBarnRadio;
