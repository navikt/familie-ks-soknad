import React from 'react';

import { ArrowLeftIcon, ArrowRightIcon, FloppydiskIcon, PaperplaneIcon, TrashIcon } from '@navikt/aksel-icons';
import { Box, Button, HGrid, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useAppContext } from '../../../context/AppContext';
import { useStegContext } from '../../../context/StegContext';
import { RouteEnum } from '../../../typer/routes';
import { useBekreftelseOgStartSoknad } from '../../SøknadsSteg/Forside/useBekreftelseOgStartSoknad';

import { SlettSøknadenModal } from './SlettSøknadenModal';

const Navigeringspanel: React.FC<{
    onAvbrytCallback: (event) => void;
    onTilbakeCallback: () => void;
    valideringErOk: (() => boolean) | undefined;
}> = ({ onAvbrytCallback, onTilbakeCallback, valideringErOk }) => {
    const { hentNesteSteg } = useStegContext();
    const nesteSteg = hentNesteSteg();
    const { innsendingStatus, tekster, plainTekst } = useAppContext();
    const { visStartPåNyttModal, settVisStartPåNyttModal, startPåNytt } = useBekreftelseOgStartSoknad();

    const { sendSoeknadKnapp, gaaVidereKnapp, tilbakeKnapp, fortsettSenereKnapp, slettSoeknadKnapp } =
        tekster().FELLES.navigasjon;

    return (
        <>
            <Box marginBlock="12 0">
                <VStack gap="4">
                    <HGrid gap={{ xs: '4', sm: '8 4' }} columns={{ xs: 1, sm: 2 }} width={{ sm: 'fit-content' }}>
                        <Button
                            type={'button'}
                            variant="secondary"
                            onClick={onTilbakeCallback}
                            icon={<ArrowLeftIcon aria-hidden />}
                            iconPosition="left"
                        >
                            {plainTekst(tilbakeKnapp)}
                        </Button>
                        <Button
                            type={'submit'}
                            variant={valideringErOk ? (valideringErOk() ? 'primary' : 'secondary') : 'primary'}
                            icon={
                                nesteSteg.route === RouteEnum.Kvittering ? (
                                    <PaperplaneIcon aria-hidden />
                                ) : (
                                    <ArrowRightIcon aria-hidden />
                                )
                            }
                            iconPosition="right"
                            loading={innsendingStatus.status === RessursStatus.HENTER}
                            data-testid="neste-steg"
                        >
                            {plainTekst(nesteSteg.route === RouteEnum.Kvittering ? sendSoeknadKnapp : gaaVidereKnapp)}
                        </Button>

                        <Box asChild marginBlock={{ xs: '4 0', sm: '0' }}>
                            <Button
                                variant="tertiary"
                                type={'button'}
                                onClick={onAvbrytCallback}
                                icon={<FloppydiskIcon aria-hidden />}
                                iconPosition="left"
                            >
                                {plainTekst(fortsettSenereKnapp)}
                            </Button>
                        </Box>
                        <Button
                            variant="tertiary"
                            type={'button'}
                            icon={<TrashIcon aria-hidden />}
                            iconPosition="left"
                            onClick={() => settVisStartPåNyttModal(true)}
                        >
                            {plainTekst(slettSoeknadKnapp)}
                        </Button>
                    </HGrid>
                </VStack>
            </Box>
            <SlettSøknadenModal
                open={visStartPåNyttModal}
                avbryt={() => settVisStartPåNyttModal(false)}
                startPåNytt={() => startPåNytt()}
            />
        </>
    );
};

export default Navigeringspanel;
