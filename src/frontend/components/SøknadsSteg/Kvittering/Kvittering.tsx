import React, { useEffect, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';

import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { RouteEnum } from '../../../typer/routes';
import { setUserProperty, UserProperty } from '../../../utils/amplitude';
import BlokkerTilbakeKnappModal from '../../Felleskomponenter/BlokkerTilbakeKnappModal/BlokkerTilbakeKnappModal';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { KontonummerInfo } from './KontonummerInfo';

const Kvittering: React.FC = () => {
    const { avbrytOgSlettSøknad, sisteUtfylteStegIndex, settFåttGyldigKvittering, søknad } =
        useApp();
    const { barnInkludertISøknaden, erEøs } = søknad;
    const { hentStegNummer } = useSteg();

    const { innsendingStatus } = useApp();
    const innsendtDato: Dayjs =
        innsendingStatus.status === RessursStatus.SUKSESS
            ? dayjs(innsendingStatus.data.mottattDato)
            : dayjs();

    const klokkeslett = innsendtDato.format('HH:mm');
    const dato = innsendtDato.format('DD.MM.YY');
    const [varEøsSøknad] = useState(erEøs);

    useEffect(() => {
        if (sisteUtfylteStegIndex === hentStegNummer(RouteEnum.Dokumentasjon)) {
            settFåttGyldigKvittering(true);

            // I tilfelle vi kommer via mellomlagring og ikke har satt denne fra før, sett den her før vi nullstiller søknaden
            setUserProperty(UserProperty.ANTALL_VALGTE_BARN, barnInkludertISøknaden.length);

            avbrytOgSlettSøknad();
        }
    }, []);

    return (
        <Steg tittel={<SpråkTekst id={'kvittering.sidetittel'} />}>
            <KomponentGruppe>
                <AlertStripe type="suksess">
                    <SpråkTekst
                        id={'kvittering.mottatt'}
                        values={{
                            tidspunkt: klokkeslett,
                            dato: dato,
                        }}
                    />
                </AlertStripe>
            </KomponentGruppe>
            <KomponentGruppe>
                <Normaltekst>
                    <SpråkTekst
                        id={'kvittering.info'}
                        values={{
                            lenkeDineSaker: (
                                <EksternLenke
                                    lenkeSpråkId={'kvittering.dinesaker.lenke'}
                                    lenkeTekstSpråkId={'kvittering.dinesaker.lenketekst'}
                                />
                            ),
                            lenkeFinnSaksbehandlingstid: (
                                <EksternLenke
                                    lenkeTekstSpråkId={'kvittering.saksbehandlingstid.lenketekst'}
                                    lenkeSpråkId={'kvittering.saksbehandlingstid.lenke'}
                                />
                            ),
                        }}
                    />
                </Normaltekst>
            </KomponentGruppe>

            {varEøsSøknad && (
                <KomponentGruppe>
                    <KontonummerInfo />
                </KomponentGruppe>
            )}

            <Informasjonsbolk tittelId={'kvittering.ikke-lastet-opp'}>
                <Normaltekst>
                    <SpråkTekst id={'kvittering.ettersend-dokumentasjon.info'} />
                </Normaltekst>
            </Informasjonsbolk>
            <EksternLenke
                lenkeTekstSpråkId={'kvittering.ettersend-dokumentasjon.lenketekst'}
                lenkeSpråkId={'kvittering.ettersend-dokumentasjon.lenke'}
            />
            <BlokkerTilbakeKnappModal />
        </Steg>
    );
};

export default Kvittering;
