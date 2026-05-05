import React, { FC } from 'react';

import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Button, InfoCard, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
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
            <VStack role={'navigation'} gap="space-32" marginBlock="space-32 space-0">
                <InfoCard data-color={'info'}>
                    <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
                        <TekstBlock block={forsideTekster.mellomlagretAlert} />
                    </InfoCard.Message>
                </InfoCard>
                <VStack gap="space-32" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                    <Button onClick={fortsettPåSøknaden}>{plainTekst(navigasjonTekster.fortsettKnapp)}</Button>
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
