import React, { MouseEventHandler, ReactNode, useEffect, useState } from 'react';

import { useNavigate } from 'react-router';

import { FormSummary } from '@navikt/ds-react';
import type { ISkjema } from '@navikt/familie-skjema';

import { BASE_PATH } from '../../../../shared-utils/miljø';
import { unslash } from '../../../../shared-utils/unslash';
import { useAppContext } from '../../../context/AppContext';
import { useStegContext } from '../../../context/StegContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import { ISteg, RouteEnum } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import { SkjemaFeiloppsummering } from '../../Felleskomponenter/SkjemaFeiloppsummering/SkjemaFeiloppsummering';

interface IHookReturn {
    valideringErOk: () => boolean;
    validerAlleSynligeFelter: () => void;
    skjema: ISkjema<SkjemaFeltTyper, string>;
}

interface Props {
    tittel: LocaleRecordBlock | LocaleRecordString;
    flettefelter?: FlettefeltVerdier;
    steg?: ISteg;
    skjemaHook: IHookReturn;
    settFeilAnchors?: React.Dispatch<React.SetStateAction<string[]>>;
    barn?: IBarnMedISøknad;
    children?: ReactNode;
}

function Oppsummeringsbolk({ children, tittel, flettefelter, steg, skjemaHook, settFeilAnchors, barn }: Props) {
    const { hentStegNummer } = useStegContext();
    const { søknad, plainTekst, tekster } = useAppContext();
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
    const navigate = useNavigate();

    const navigerTilSteg: MouseEventHandler = event => {
        event.preventDefault();
        navigate({
            pathname: steg?.path,
        });
    };

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level="3">
                    {`${stegnummer}. ${uppercaseFørsteBokstav(plainTekst(tittel, flettefelter))}`}
                </FormSummary.Heading>
            </FormSummary.Header>
            <FormSummary.Answers>
                {children}
                {visFeil && <SkjemaFeiloppsummering skjema={skjema} stegMedFeil={steg} id={feilOppsummeringId} />}
            </FormSummary.Answers>
            {steg && !visFeil && (
                <FormSummary.Footer>
                    <FormSummary.EditLink
                        href={BASE_PATH + unslash(steg.path)}
                        rel="noopener noreferrer"
                        onClick={navigerTilSteg}
                    >
                        {plainTekst(tekster().OPPSUMMERING.endreSvarLenkeTekst)}
                    </FormSummary.EditLink>
                </FormSummary.Footer>
            )}
        </FormSummary>
    );
}

export default Oppsummeringsbolk;
