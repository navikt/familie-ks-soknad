import React, { useState, useEffect } from 'react';

import { BodyShort, Heading, Loader } from '@navikt/ds-react';
import {
    Ressurs,
    RessursStatus,
    byggTomRessurs,
    byggHenterRessurs,
    byggFeiletRessurs,
} from '@navikt/familie-typer';

import Miljø from '../../../shared-utils/Miljø';
import { useApp } from '../../context/AppContext';

const Helse: React.FC = () => {
    const { axiosRequest } = useApp();

    const [helseApi, settHelseApi] = useState(byggTomRessurs<string>());
    const [helseMottak, settHelseMottak] = useState(byggTomRessurs<string>());
    const [helsePdl, settHelsePdl] = useState(byggTomRessurs<string>());
    const { soknadApiProxyUrl } = Miljø();

    useEffect(() => {
        settHelseApi(byggHenterRessurs());
        settHelseMottak(byggHenterRessurs());
        settHelsePdl(byggHenterRessurs());

        axiosRequest<string, void>({
            url: `${soknadApiProxyUrl}/helse/soknad-api`,
            method: 'GET',
        })
            .then(ressurs => {
                settHelseApi(ressurs);
            })
            .catch(() => {
                settHelseApi(byggFeiletRessurs('Helse mot backend feilet'));
            });

        axiosRequest<string, void>({
            url: `${soknadApiProxyUrl}/helse/mottak`,
            method: 'GET',
        })
            .then(ressurs => {
                settHelseMottak(ressurs);
            })
            .catch(() => {
                settHelseMottak(byggFeiletRessurs('Helse mot mottak feilet'));
            });

        axiosRequest<string, void>({
            url: `${soknadApiProxyUrl}/helse/pdl`,
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
            <Heading level={'2'} size={'small'}>
                Helse
            </Heading>
            {renderHelse(helseApi, 'søknad api')}
            {renderHelse(helseMottak, 'mottak')}
            {renderHelse(helsePdl, 'pdl')}
        </div>
    );
};

const renderHelse = (ressurs: Ressurs<string>, tjeneste: string) => {
    return (
        <div className={'helse__tjeneste'}>
            <BodyShort>{`Svar fra ${tjeneste}:`}</BodyShort>
            {ressurs.status === RessursStatus.SUKSESS && (
                <BodyShort children={`suksess (${ressurs.data})`} />
            )}
            {ressurs.status === RessursStatus.HENTER && <Loader />}
            {ressurs.status === RessursStatus.FEILET && (
                <BodyShort children={`feilet (${ressurs.frontendFeilmelding})`} />
            )}
        </div>
    );
};

export default Helse;
