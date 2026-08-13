import { BodyShort, Button, Modal, VStack } from '@navikt/ds-react';
import React, { type ReactNode } from 'react';

import type { FlettefeltVerdier } from '../../../../common/typer/kontrakt/generelle';
import type { LocaleRecordBlock } from '../../../../common/typer/locale';
import { useAppContext } from '../../../context/AppContext';
import ModalContent from '../ModalContent';

interface Props {
    erÅpen: boolean;
    lukkModal: () => void;
    submitSpinner?: boolean;
    valideringErOk: () => boolean;
    onAvbrytCallback?: () => void;
    onSubmitCallback: () => void;
    tittel: LocaleRecordBlock;
    forklaring?: string;
    submitKnappTekst: ReactNode;
    flettefelter?: FlettefeltVerdier;
    children?: ReactNode;
}

function SkjemaModal({
    erÅpen,
    lukkModal,
    submitSpinner = false,
    valideringErOk,
    onAvbrytCallback,
    onSubmitCallback,
    tittel,
    forklaring = undefined,
    submitKnappTekst,
    flettefelter,
    children,
}: Props) {
    const { plainTekst } = useAppContext();

    return (
        <Modal
            open={erÅpen}
            onClose={() => {
                lukkModal();
                if (onAvbrytCallback) {
                    onAvbrytCallback();
                }
            }}
            width={'medium'}
            portal={true}
            header={{
                heading: plainTekst(tittel, flettefelter),
                size: 'medium',
            }}
        >
            <ModalContent>
                <BodyShort spacing>{forklaring}</BodyShort>
                <form id="skjema">
                    <VStack gap="space-40">{children}</VStack>
                </form>
            </ModalContent>
            <Modal.Footer>
                <Button
                    form="skjema"
                    variant={valideringErOk() ? 'primary' : 'secondary'}
                    data-testid={'submit-knapp-i-modal'}
                    loading={!!submitSpinner}
                    onClick={event => {
                        event.preventDefault();
                        onSubmitCallback();
                    }}
                >
                    {submitKnappTekst}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SkjemaModal;
