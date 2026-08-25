import { useTranslate } from '@hooks/useTranslate';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Button, InfoCard, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { useSanityTekster } from '../../../context/SanityContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { SlettSøknadenModal } from '../../Felleskomponenter/Steg/SlettSøknadenModal';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

export const FortsettPåSøknad: FC = () => {
    const { fortsettPåSøknaden, visStartPåNyttModal, settVisStartPåNyttModal, startPåNytt } =
        useBekreftelseOgStartSoknad();

    const forsidetekster = useSanityTekster(ESanitySteg.FORSIDE);
    const fellestekster = useSanityTekster(ESanitySteg.FELLES);
    const translate = useTranslate();

    return (
        <>
            <VStack role={'navigation'} gap="space-32" marginBlock="space-32 space-0">
                <InfoCard data-color={'info'}>
                    <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
                        <TekstBlock block={forsidetekster.mellomlagretAlert} />
                    </InfoCard.Message>
                </InfoCard>
                <VStack gap="space-32" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                    <Button onClick={fortsettPåSøknaden}>{translate(fellestekster.navigasjon.fortsettKnapp)}</Button>
                    <Button variant={'secondary'} onClick={() => settVisStartPåNyttModal(true)}>
                        {translate(fellestekster.navigasjon.startPaaNyttKnapp)}
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
