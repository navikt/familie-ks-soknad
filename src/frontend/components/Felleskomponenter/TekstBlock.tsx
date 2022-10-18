import React from 'react';

import { PortableText } from '@portabletext/react';
import styled from 'styled-components';

import {
    BodyLong,
    BodyShort,
    Detail,
    ErrorMessage,
    Heading,
    Ingress,
    Label,
} from '@navikt/ds-react';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../context/AppContext';
import { LocaleRecordBlock, Typografi } from '../../typer/common';
import { FlettefeltVerdier } from '../../typer/kontrakt/generelle';

const StyledLabel = styled(Label)`
    display: block;
`;

interface Props {
    typografi?: Typografi;
}

const StyledBodyLong = styled(BodyLong)`
    :empty {
        height: 1.625rem;
    }
`;

export const TypografiWrapper: React.FC<Props> = ({ children, typografi }) => {
    switch (typografi) {
        case Typografi.StegHeadingH1:
            return (
                <Heading level={'1'} size={'xsmall'}>
                    {children}
                </Heading>
            );
        case Typografi.ModalHeadingH1:
            return (
                <Heading level={'1'} size={'large'}>
                    {children}
                </Heading>
            );
        case Typografi.ForsideHeadingH1:
            return (
                <Heading level={'1'} size={'xlarge'}>
                    {children}
                </Heading>
            );
        case Typografi.HeadingH2:
            return (
                <Heading level={'2'} size={'xsmall'} spacing>
                    {children}
                </Heading>
            );
        case Typografi.Ingress:
            return <Ingress>{children}</Ingress>;
        case Typografi.BodyLong:
            return <StyledBodyLong>{children}</StyledBodyLong>;
        case Typografi.BodyShort:
            return <BodyShort>{children}</BodyShort>;
        case Typografi.Label:
            return <StyledLabel>{children}</StyledLabel>;
        case Typografi.Detail:
            return <Detail>{children}</Detail>;
        case Typografi.ErrorMessage:
            return <ErrorMessage>{children}</ErrorMessage>;
        case undefined:
            return <>{children}</>;
    }
};

const TekstBlock: React.FC<{
    block: LocaleRecordBlock | undefined;
    flettefelter?: FlettefeltVerdier;
    typografi?: Typografi;
}> = ({ block, flettefelter, typografi }) => {
    const [valgtLocale] = useSprakContext();
    const { flettefeltTilTekst } = useApp();

    return block ? (
        <PortableText
            value={block[valgtLocale]}
            components={{
                block: {
                    normal: ({ children }) => (
                        <TypografiWrapper typografi={typografi}>{children}</TypografiWrapper>
                    ),
                    h1: ({ children }) => (
                        <TypografiWrapper typografi={typografi}>{children}</TypografiWrapper>
                    ),
                },
                marks: {
                    flettefelt: props => {
                        if (props?.value?.flettefeltVerdi) {
                            return (
                                <span>
                                    {flettefeltTilTekst(props.value.flettefeltVerdi, flettefelter)}
                                </span>
                            );
                        } else {
                            throw new Error(`Fant ikke flettefeltVerdi`);
                        }
                    },
                    link: props => {
                        return (
                            <a
                                target={props.value.blank ? '_blank' : '_self'}
                                rel={'noopener noreferrer'}
                                href={encodeURI(props.value.href)}
                                style={{ display: 'inline-block' }}
                            >
                                {props.text}
                            </a>
                        );
                    },
                },
            }}
        />
    ) : null;
};

export default TekstBlock;
