import React, { FC } from 'react';

import { Alert, Button, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { SlettSøknadenModal } from '../../Felleskomponenter/Steg/SlettSøknadenModal';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

export const FortsettPåSøknad: FC = () => {
    const { tekster, plainTekst } = useAppContext();
    const { fortsettPåSøknaden, visStartPåNyttModal, settVisStartPåNyttModal, startPåNytt } =
        useBekreftelseOgStartSoknad();

    const forsideTekster = tekster().FORSIDE;
    const navigasjonTekster = tekster().FELLES.navigasjon;

    return (
        <>
            <VStack role={'navigation'} gap="8" marginBlock="8 0">
                <Alert variant={'info'}>
                    <TekstBlock
                        block={forsideTekster.mellomlagretAlert}
                        typografi={Typografi.BodyLong}
                    />
                </Alert>
                <VStack gap="8" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                    <Button onClick={fortsettPåSøknaden}>
                        {plainTekst(navigasjonTekster.fortsettKnapp)}
                    </Button>
                    <Button variant={'secondary'} onClick={() => settVisStartPåNyttModal(true)}>
                        {plainTekst(navigasjonTekster.startPaaNyttKnapp)}
                    </Button>
                </VStack>
            </VStack>
            <SlettSøknadenModal
                open={visStartPåNyttModal}
                avbryt={() => settVisStartPåNyttModal(false)}
                startPåNytt={() => startPåNytt()}
            />
        </>
    );
};
