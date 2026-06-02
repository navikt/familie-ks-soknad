import React from 'react';

import classNames from 'classnames';

import { PaperclipIcon, TrashFillIcon } from '@navikt/aksel-icons';
import { Button, HStack, List } from '@navikt/ds-react';

import { useAppContext } from '../../../../context/AppContext';
import { Typografi } from '../../../../typer/common';
import { IVedlegg } from '../../../../typer/dokumentasjon';
import { formaterFilstørrelse } from '../../../../utils/dokumentasjon';
import { TypografiWrapper } from '../../../Felleskomponenter/TekstBlock';

import styles from './OpplastedeFiler.module.css';

interface Props {
    filliste: IVedlegg[];
    slettVedlegg: (vedlegg: IVedlegg) => void;
}

const OpplastedeFiler: React.FC<Props> = ({ filliste, slettVedlegg }) => {
    const { tekster, plainTekst } = useAppContext();
    return (
        <List>
            {filliste.map((fil: IVedlegg, index: number) => {
                return (
                    <List.Item
                        key={fil.dokumentId}
                        className={classNames({ [styles.separator]: index !== filliste.length - 1 })}
                        icon={<PaperclipIcon focusable={false} role={'img'} aria-hidden={true} aria-label={''} />}
                    >
                        <HStack justify={'space-between'}>
                            <TypografiWrapper typografi={Typografi.BodyShort}>
                                {`${fil.navn} (${formaterFilstørrelse(fil.størrelse)})`}
                            </TypografiWrapper>
                            <Button
                                variant={'tertiary'}
                                onClick={() => slettVedlegg(fil)}
                                icon={<TrashFillIcon focusable={false} aria-hidden />}
                                iconPosition={'right'}
                            >
                                {plainTekst(tekster().DOKUMENTASJON.slett)}
                            </Button>
                        </HStack>
                    </List.Item>
                );
            })}
        </List>
    );
};

export default OpplastedeFiler;
