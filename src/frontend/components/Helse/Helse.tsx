import React, { useEffect, useState } from 'react';

import { Heading, Loader } from '@navikt/ds-react';
import {
    byggFeiletRessurs,
    byggHenterRessurs,
    byggTomRessurs,
    type Ressurs,
    RessursStatus,
} from '@navikt/familie-typer';

import miljø from '../../../shared-utils/miljø';
import { useAppContext } from '../../context/AppContext';
import { Typografi } from '../../typer/common';
import { TypografiWrapper } from '../Felleskomponenter/TekstBlock';

const Helse: React.FC = () => {
    const { axiosRequest } = useAppContext();

    const [helseApi, settHelseApi] = useState(byggTomRessurs<string>());
    const [helseMottak, settHelseMottak] = useState(byggTomRessurs<string>());
    const [helsePdl, settHelsePdl] = useState(byggTomRessurs<string>());
    const { soknadApiProxyUrl } = miljø();

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
            <TypografiWrapper
                typografi={Typografi.BodyShort}
            >{`Svar fra ${tjeneste}:`}</TypografiWrapper>
            {ressurs.status === RessursStatus.SUKSESS && (
                <TypografiWrapper
                    typografi={Typografi.BodyShort}
                    children={`suksess (${ressurs.data})`}
                />
            )}
            {ressurs.status === RessursStatus.HENTER && <Loader />}
            {ressurs.status === RessursStatus.FEILET && (
                <TypografiWrapper
                    typografi={Typografi.BodyShort}
                    children={`feilet (${ressurs.frontendFeilmelding})`}
                />
            )}
        </div>
    );
};

export default Helse;
