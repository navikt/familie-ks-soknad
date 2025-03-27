import React, { ReactNode } from 'react';

import { BodyShort, Button, Modal, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import { LocaleRecordBlock } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
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
    const { toggles } = useFeatureToggles();

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
                {toggles.FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP && forklaring && (
                    <BodyShort spacing>{forklaring}</BodyShort>
                )}
                <form id="skjema">
                    <VStack gap="10">{children}</VStack>
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
