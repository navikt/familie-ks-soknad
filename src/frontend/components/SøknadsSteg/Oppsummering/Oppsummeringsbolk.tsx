import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Accordion } from '@navikt/ds-react';
import { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
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

const StyledAccordionContent = styled(Accordion.Content)`
    width: 100%;
`;

interface Props {
    tittel: LocaleRecordBlock | LocaleRecordString;
    flettefelter?: FlettefeltVerdier;
    steg?: ISteg;
    skjemaHook: IHookReturn;
    settFeilAnchors?: React.Dispatch<React.SetStateAction<string[]>>;
    barn?: IBarnMedISøknad;
}

const Oppsummeringsbolk: React.FC<Props> = ({
    children,
    tittel,
    flettefelter,
    steg,
    skjemaHook,
    settFeilAnchors,
    barn,
}) => {
    const { hentStegNummer } = useSteg();
    const { søknad, plainTekst, tekster } = useApp();
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

    const stegnummer = hentStegNummer(steg?.route ?? RouteEnum.OmDeg, barn);

    return (
        <Accordion>
            <Accordion.Item defaultOpen={true}>
                <Accordion.Header type="button">
                    {`${stegnummer}. ${uppercaseFørsteBokstav(plainTekst(tittel, flettefelter))}`}
                </Accordion.Header>
                <StyledAccordionContent>
                    {children}
                    {visFeil && (
                        <SkjemaFeiloppsummering
                            skjema={skjema}
                            overstyrMedLenkeTilSteg={steg}
                            id={feilOppsummeringId}
                        />
                    )}
                    {steg && !visFeil && (
                        <AppLenke steg={steg}>
                            {plainTekst(tekster().OPPSUMMERING.endreSvarLenkeTekst)}
                        </AppLenke>
                    )}
                </StyledAccordionContent>
            </Accordion.Item>
        </Accordion>
    );
};

export default Oppsummeringsbolk;
