import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Accordion } from '@navikt/ds-react';
import { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import { ISteg, RouteEnum } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { AppLenke } from '../../Felleskomponenter/AppLenke/AppLenke';
import { SkjemaFeiloppsummering } from '../../Felleskomponenter/SkjemaFeiloppsummering/SkjemaFeiloppsummering';

interface IHookReturn {
    valideringErOk: () => boolean;
    validerAlleSynligeFelter: () => void;
    skjema: ISkjema<SkjemaFeltTyper, string>;
}

const StyledAccordionContent = styled(Accordion.Content)`
    width: 100%;
`;

interface Props {
    tittel: LocaleRecordBlock | LocaleRecordString;
    flettefelter?: FlettefeltVerdier;
    steg?: ISteg;
    skjemaHook: IHookReturn;
    settFeilAnchors?: React.Dispatch<React.SetStateAction<string[]>>;
}

const Oppsummeringsbolk: React.FC<Props> = ({
    children,
    tittel,
    flettefelter,
    steg,
    skjemaHook,
    settFeilAnchors,
}) => {
    const { hentStegNummer } = useSteg();
    const { søknad, plainTekst } = useApp();
    const { validerAlleSynligeFelter, valideringErOk, skjema } = skjemaHook;
    const [visFeil, settVisFeil] = useState(false);

    const feilOppsummeringId = skjema.skjemanavn + '-feil';

    useEffect(() => {
        // Når felter valideres blir nye synlige, så vi må kjøre denne igjen til vi har validert alt
        validerAlleSynligeFelter();
    }, [søknad, skjema]);

    useEffect(() => {
        visFeil !== !valideringErOk() && settVisFeil(!valideringErOk());
    }, [skjema]);

    useEffect(() => {
        settFeilAnchors &&
            settFeilAnchors(prevState => {
                const utenDetteSkjemaet = prevState.filter(anchor => {
                    return anchor !== feilOppsummeringId;
                });
                return visFeil ? [...utenDetteSkjemaet, feilOppsummeringId] : utenDetteSkjemaet;
            });
    }, [visFeil]);

    return (
        <Accordion>
            <Accordion.Item defaultOpen={true}>
                <Accordion.Header type="button">
                    {steg?.route !== RouteEnum.OmBarnet &&
                        steg?.route !== RouteEnum.EøsForBarn &&
                        `${hentStegNummer(steg?.route ?? RouteEnum.OmDeg)}. `}
                    {plainTekst ? plainTekst(tittel, flettefelter) : null}
                </Accordion.Header>
                <StyledAccordionContent>
                    {children}
                    {visFeil && (
                        <SkjemaFeiloppsummering
                            skjema={skjema}
                            routeForFeilmeldinger={steg}
                            id={feilOppsummeringId}
                        />
                    )}
                    {steg && !visFeil && (
                        <AppLenke steg={steg} språkTekstId={'oppsummering.endresvar.lenketekst'} />
                    )}
                </StyledAccordionContent>
            </Accordion.Item>
        </Accordion>
    );
};

export default Oppsummeringsbolk;
