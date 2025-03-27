import React from 'react';

import { FileUpload, Heading, List, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../../context/AppContext';
import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import { uppercaseFørsteBokstav } from '../../../../utils/visning';

import { ECustomFileRejectionReasons, useFilopplaster2 } from './useFilopplaster2';

interface IFilopplasterProps {
    dokumentasjon: IDokumentasjon;
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void;
}

const Filopplaster2: React.FC<IFilopplasterProps> = ({ dokumentasjon, oppdaterDokumentasjon }) => {
    const { tekster, plainTekst } = useAppContext();

    const dokumentasjonTekster = tekster().DOKUMENTASJON;
    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const {
        filerUnderOpplastning,
        avvisteFiler,
        MAKS_FILSTØRRELSE_MB,
        MAKS_FILSTØRRELSE_BYTES,
        MAKS_ANTALL_FILER,
        STØTTEDE_FILTYPER,
        feilmeldinger,
        leggTilVedlegg,
        fjernVedlegg,
        fjernAvvistFil,
        prøvOpplastingAvAvvistFilPåNytt,
    } = useFilopplaster2(dokumentasjon, oppdaterDokumentasjon, dokumentasjonTekster, plainTekst);

    return (
        <FileUpload
            translations={{
                dropzone: {
                    button: plainTekst(dokumentasjonTekster.velgFil),
                    buttonMultiple: plainTekst(dokumentasjonTekster.velgFiler),
                    dragAndDrop: plainTekst(dokumentasjonTekster.draOgSlippFilenHer),
                    dragAndDropMultiple: plainTekst(dokumentasjonTekster.draOgSlippFilerHer),
                    drop: uppercaseFørsteBokstav(plainTekst(frittståendeOrdTekster.slipp)),
                    or: plainTekst(frittståendeOrdTekster.eller),
                    disabled: plainTekst(
                        filerUnderOpplastning.length > 0
                            ? dokumentasjonTekster.filopplastingDeaktivertFilerErUnderOpplastning
                            : dokumentasjonTekster.filopplastingDeaktivert
                    ),
                    disabledFilelimit: plainTekst(
                        dokumentasjonTekster.filopplastingDeaktivertMaksAntallFiler
                    ),
                },
                item: {
                    retryButtonTitle: plainTekst(dokumentasjonTekster.lastOppFilenPaNytt),
                    deleteButtonTitle: plainTekst(dokumentasjonTekster.slettFilen),
                    uploading: plainTekst(dokumentasjonTekster.lasterOpp),
                    downloading: plainTekst(dokumentasjonTekster.lasterNed),
                },
            }}
        >
            <VStack gap="6">
                <FileUpload.Dropzone
                    label={plainTekst(dokumentasjonTekster.lastOppFiler)}
                    description={
                        <List as="ul" size="small">
                            <List.Item>{`${plainTekst(dokumentasjonTekster.stottedeFiltyper)} ${STØTTEDE_FILTYPER.join(' ')}`}</List.Item>
                            <List.Item>{`${plainTekst(dokumentasjonTekster.maksFilstorrelse)} ${MAKS_FILSTØRRELSE_MB} MB`}</List.Item>
                            <List.Item>{`${plainTekst(dokumentasjonTekster.maksAntallFiler)} ${MAKS_ANTALL_FILER}`}</List.Item>
                        </List>
                    }
                    accept={STØTTEDE_FILTYPER.join(',')}
                    maxSizeInBytes={MAKS_FILSTØRRELSE_BYTES}
                    fileLimit={{
                        max: MAKS_ANTALL_FILER,
                        current: dokumentasjon.opplastedeVedlegg.length,
                    }}
                    // Dersom disabled blir satt til false her vil dette overskrive disabled-staten som blir satt av "fileLimit" prop-en. Derfor settes den til undefined slik at "fileLimit" fungerer som forventet.
                    disabled={filerUnderOpplastning.length > 0 ? true : undefined}
                    onSelect={nyeFiler => leggTilVedlegg(nyeFiler)}
                />

                {(dokumentasjon.opplastedeVedlegg.length > 0 ||
                    filerUnderOpplastning.length > 0) && (
                    <VStack gap="2">
                        <Heading level="4" size="xsmall">
                            {`${plainTekst(frittståendeOrdTekster.vedlegg)} (${dokumentasjon.opplastedeVedlegg.length + filerUnderOpplastning.length})`}
                        </Heading>
                        <VStack as="ul" gap="3">
                            {dokumentasjon.opplastedeVedlegg.map((opplastetVedlegg, index) => (
                                <FileUpload.Item
                                    as="li"
                                    key={index}
                                    file={{
                                        name: opplastetVedlegg.navn,
                                        size: opplastetVedlegg.størrelse,
                                    }}
                                    button={{
                                        action: 'delete',
                                        onClick: () => fjernVedlegg(opplastetVedlegg),
                                    }}
                                />
                            ))}
                            {filerUnderOpplastning.map((filUnderOpplastning, index) => (
                                <FileUpload.Item
                                    as="li"
                                    key={index}
                                    file={{
                                        name: filUnderOpplastning.file.name,
                                        size: filUnderOpplastning.file.size,
                                    }}
                                    status="uploading"
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}

                {avvisteFiler.length > 0 && (
                    <VStack gap="2">
                        <Heading level="4" size="xsmall">
                            {`${plainTekst(frittståendeOrdTekster.vedleggMedFeil)} (${avvisteFiler.length})`}
                        </Heading>
                        <VStack as="ul" gap="3">
                            {avvisteFiler.map((fil, index) => (
                                <FileUpload.Item
                                    as="li"
                                    key={index}
                                    file={{
                                        name: fil.file.name,
                                        size: fil.file.size,
                                    }}
                                    error={feilmeldinger[fil.reasons[0]]}
                                    button={
                                        fil.reasons[0] === ECustomFileRejectionReasons.UKJENT_FEIL
                                            ? {
                                                  action: 'retry',
                                                  onClick: () =>
                                                      prøvOpplastingAvAvvistFilPåNytt(fil),
                                              }
                                            : {
                                                  action: 'delete',
                                                  onClick: () => fjernAvvistFil(fil),
                                              }
                                    }
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </FileUpload>
    );
};

export default Filopplaster2;
