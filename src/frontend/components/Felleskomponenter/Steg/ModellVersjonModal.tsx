import React from 'react';

import { XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import ModalContent from '../ModalContent';
import TekstBlock from '../TekstBlock';

const ModellVersjonModal: React.FC<{ erÅpen: boolean }> = ({ erÅpen }) => {
    const { tekster, plainTekst } = useAppContext();

    const mistetInformasjonenDinTekster = tekster().FELLES.modaler.mistetInformasjonenDin;

    const refresh = () => window.location.reload();

    return (
        <Modal
            open={erÅpen}
            onClose={refresh}
            header={{
                heading: plainTekst(mistetInformasjonenDinTekster.tittel),
                size: 'medium',
                icon: <XMarkOctagonFillIcon color="var(--a-surface-danger)" />,
            }}
        >
            <ModalContent>
                <TekstBlock block={mistetInformasjonenDinTekster.info} typografi={Typografi.BodyLong} />
            </ModalContent>
            <Modal.Footer>
                <Button onClick={refresh}>
                    <TekstBlock block={mistetInformasjonenDinTekster.knapp} typografi={Typografi.BodyShort} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModellVersjonModal;
