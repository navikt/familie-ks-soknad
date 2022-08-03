import React from 'react';

import styled from 'styled-components';

import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';

import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { ISteg } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
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
    return (
        <Container>
            <Feiloppsummering
                role={'alert'}
                id={id}
                tittel={
                    <Element>
                        <SpråkTekst id={'felles.feiloppsummering.tittel'} />
                    </Element>
                }
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
