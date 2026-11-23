import ModalContent from '@components/Felleskomponenter/ModalContent';
import TekstBlock from '@components/Felleskomponenter/TekstBlock';
import { useAppContext } from '@context/AppContext';
import { useAppNavigationContext } from '@context/AppNavigationContext';
import { Button, HStack, Modal } from '@navikt/ds-react';
import { Typografi } from '@typer/common';
import { ESanitySteg } from '@typer/sanity/sanity';

const BlokkerTilbakeKnappModal = () => {
    const { visBlokkerTilbakeKnappModal, settVisBlokkerTilbakeKnappModal } = useAppNavigationContext();

    const { tekster, plainTekst } = useAppContext();
    const blokkerTilbakeknappTekster = tekster()[ESanitySteg.FELLES].modaler.blokkerTilbakeKnapp;

    const håndterAvbryt = () => {
        settVisBlokkerTilbakeKnappModal(false);
    };

    return (
        <Modal
            onClose={() => settVisBlokkerTilbakeKnappModal(false)}
            open={visBlokkerTilbakeKnappModal}
            header={{
                heading: plainTekst(blokkerTilbakeknappTekster.tittel),
                size: 'medium',
            }}
        >
            <ModalContent>
                <TekstBlock block={blokkerTilbakeknappTekster.tekst} typografi={Typografi.BodyLong} />
            </ModalContent>
            <Modal.Footer>
                <HStack gap={'space-16'} align={'center'}>
                    <TekstBlock block={blokkerTilbakeknappTekster.tilDittNav} typografi={Typografi.BodyShort} />
                    <Button onClick={håndterAvbryt}>
                        <TekstBlock block={blokkerTilbakeknappTekster.avbryt} typografi={Typografi.BodyShort} />
                    </Button>
                </HStack>
            </Modal.Footer>
        </Modal>
    );
};

export default BlokkerTilbakeKnappModal;
