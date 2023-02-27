import React from 'react';

import styled from 'styled-components';

import { Attachment, DeleteFilled } from '@navikt/ds-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../../context/AppContext';
import { IVedlegg } from '../../../../typer/dokumentasjon';
import { formaterFilstørrelse } from '../../../../utils/dokumentasjon';

interface Props {
    filliste: IVedlegg[];
    slettVedlegg: (vedlegg: IVedlegg) => void;
}

const FilListe = styled.ul`
    padding: 0;
`;

const FilRad = styled.li<{ skillelinje: boolean }>`
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: ${props => (props.skillelinje ? `1px solid ${ABorderDivider}` : 'none')};
`;

const FilTekstWrapper = styled.div`
    display: flex;
    align-items: center;
    word-break: break-all;
    margin-right: 1rem;
`;

const StyledAttachment = styled(Attachment)`
    margin-right: 1rem;
    min-width: 1rem;
`;

const OpplastedeFiler: React.FC<Props> = ({ filliste, slettVedlegg }) => {
    const { tekster, plainTekst } = useApp();
    return (
        <FilListe>
            {filliste.map((fil: IVedlegg, index: number) => {
                return (
                    <FilRad key={fil.dokumentId} skillelinje={index !== filliste.length - 1}>
                        <FilTekstWrapper>
                            <StyledAttachment
                                focusable={false}
                                role={'img'}
                                aria-hidden={true}
                                aria-label={''}
                            />
                            <BodyShort>
                                {`${fil.navn} (${formaterFilstørrelse(fil.størrelse)})`}
                            </BodyShort>
                        </FilTekstWrapper>
                        <Button
                            variant={'tertiary'}
                            onClick={() => slettVedlegg(fil)}
                            icon={<DeleteFilled focusable={false} />}
                            iconPosition={'right'}
                        >
                            {plainTekst(tekster().DOKUMENTASJON.slett)}
                        </Button>
                    </FilRad>
                );
            })}
        </FilListe>
    );
};

export default OpplastedeFiler;
