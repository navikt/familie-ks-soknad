import React, { useState, useEffect } from 'react';

import NavFrontendSpinner from 'nav-frontend-spinner';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';

import {
    Ressurs,
    RessursStatus,
    byggTomRessurs,
    byggHenterRessurs,
    byggFeiletRessurs,
} from '@navikt/familie-typer';

import { useApp } from '../../context/AppContext';
import Miljø from '../../Miljø';

const Helse: React.FC = () => {
    const { axiosRequest } = useApp();

    const [helseApi, settHelseApi] = useState(byggTomRessurs<string>());
    const [helseMottak, settHelseMottak] = useState(byggTomRessurs<string>());
    const [helsePdl, settHelsePdl] = useState(byggTomRessurs<string>());
    const { soknadApi } = Miljø();

    useEffect(() => {
        settHelseApi(byggHenterRessurs());
        settHelseMottak(byggHenterRessurs());
        settHelsePdl(byggHenterRessurs());

        axiosRequest<string, void>({
            url: `${soknadApi}/helse/soknad-api`,
            method: 'GET',
        })
            .then(ressurs => {
                settHelseApi(ressurs);
            })
            .catch(() => {
                settHelseApi(byggFeiletRessurs('Helse mot backend feilet'));
            });

        axiosRequest<string, void>({
            url: `${soknadApi}/helse/mottak`,
            method: 'GET',
        })
            .then(ressurs => {
                settHelseMottak(ressurs);
            })
            .catch(() => {
                settHelseMottak(byggFeiletRessurs('Helse mot mottak feilet'));
            });

        axiosRequest<string, void>({
            url: `${soknadApi}/helse/pdl`,
            method: 'GET',
        })
            .then(ressurs => {
                settHelsePdl(ressurs);
            })
            .catch(() => {
                settHelsePdl(byggFeiletRessurs('Helse mot pdl feilet'));
            });
    }, []);

    return (
        <div className={'helse'}>
            <Undertittel>Helse</Undertittel>
            {renderHelse(helseApi, 'søknad api')}
            {renderHelse(helseMottak, 'mottak')}
            {renderHelse(helsePdl, 'pdl')}
        </div>
    );
};

const renderHelse = (ressurs: Ressurs<string>, tjeneste: string) => {
    return (
        <div className={'helse__tjeneste'}>
            <Normaltekst>{`Svar fra ${tjeneste}:`}</Normaltekst>
            {ressurs.status === RessursStatus.SUKSESS && (
                <Normaltekst children={`suksess (${ressurs.data})`} />
            )}
            {ressurs.status === RessursStatus.HENTER && <NavFrontendSpinner />}
            {ressurs.status === RessursStatus.FEILET && (
                <Normaltekst children={`feilet (${ressurs.frontendFeilmelding})`} />
            )}
        </div>
    );
};

export default Helse;
