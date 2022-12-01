import React from 'react';

import styled from 'styled-components';

import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';

import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { ISteg } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { lagRouteFeilRenderer } from './lagRouteFeilRenderer';

interface Props {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    routeForFeilmeldinger?: ISteg;
    id?: string;
}

const Container = styled.div`
    margin-top: 2rem;
`;

export const SkjemaFeiloppsummering: React.FC<Props> = ({ skjema, routeForFeilmeldinger, id }) => {
    const { tekster, plainTekst } = useApp();
    return (
        <Container>
            <Feiloppsummering
                role={'alert'}
                id={id}
                tittel={plainTekst(tekster().FELLES.navigasjon.duMaaRetteOppFoelgende)}
                customFeilRender={
                    routeForFeilmeldinger ? lagRouteFeilRenderer(routeForFeilmeldinger) : undefined
                }
                feil={Object.values(skjema.felter)
                    .filter(felt => {
                        return felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL;
                    })
                    .map((felt): FeiloppsummeringFeil => {
                        return {
                            skjemaelementId: felt.id,
                            feilmelding: felt.feilmelding,
                        };
                    })}
            />
        </Container>
    );
};
