import React, { ReactNode, useEffect, useState } from 'react';

import styled from 'styled-components';

import { FormSummary } from '@navikt/ds-react';
import type { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useStegContext } from '../../../context/StegContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import { ISteg, RouteEnum } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import { AppLenke } from '../../Felleskomponenter/AppLenke/AppLenke';
import { SkjemaFeiloppsummering } from '../../Felleskomponenter/SkjemaFeiloppsummering/SkjemaFeiloppsummering';

interface IHookReturn {
    valideringErOk: () => boolean;
    validerAlleSynligeFelter: () => void;
    skjema: ISkjema<SkjemaFeltTyper, string>;
}

const StyledAppLenkeTekst = styled.span`
    && {
        white-space: nowrap;
    }
`;

interface Props {
    tittel: LocaleRecordBlock | LocaleRecordString;
    flettefelter?: FlettefeltVerdier;
    steg?: ISteg;
    skjemaHook: IHookReturn;
    settFeilAnchors?: React.Dispatch<React.SetStateAction<string[]>>;
    barn?: IBarnMedISøknad;
    children?: ReactNode;
}

function Oppsummeringsbolk({
    children,
    tittel,
    flettefelter,
    steg,
    skjemaHook,
    settFeilAnchors,
    barn,
}: Props) {
    const { hentStegNummer } = useStegContext();
    const { søknad, plainTekst, tekster } = useApp();
    const { validerAlleSynligeFelter, valideringErOk, skjema } = skjemaHook;
    const [visFeil, settVisFeil] = useState(false);

    const feilOppsummeringId = skjema.skjemanavn + '-feil';

    useEffect(() => {
        // Når felter valideres blir nye synlige, så vi må kjøre denne igjen til vi har validert alt
        validerAlleSynligeFelter();
    }, [søknad, skjema]);

    useEffect(() => {
        if (visFeil !== !valideringErOk()) {
            settVisFeil(!valideringErOk());
        }
    }, [skjema]);

    useEffect(() => {
        if (settFeilAnchors) {
            settFeilAnchors(prevState => {
                const utenDetteSkjemaet = prevState.filter(anchor => {
                    return anchor !== feilOppsummeringId;
                });
                return visFeil ? [...utenDetteSkjemaet, feilOppsummeringId] : utenDetteSkjemaet;
            });
        }
    }, [visFeil]);

    const stegnummer = hentStegNummer(steg?.route ?? RouteEnum.OmDeg, barn);

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level="3">
                    {`${stegnummer}. ${uppercaseFørsteBokstav(plainTekst(tittel, flettefelter))}`}
                </FormSummary.Heading>
                {steg && !visFeil && (
                    <AppLenke steg={steg}>
                        <StyledAppLenkeTekst>
                            {plainTekst(tekster().OPPSUMMERING.endreSvarLenkeTekst)}
                        </StyledAppLenkeTekst>
                    </AppLenke>
                )}
            </FormSummary.Header>
            <FormSummary.Answers>
                {children}
                {visFeil && (
                    <SkjemaFeiloppsummering
                        skjema={skjema}
                        stegMedFeil={steg}
                        id={feilOppsummeringId}
                    />
                )}
            </FormSummary.Answers>
        </FormSummary>
    );
}

export default Oppsummeringsbolk;
