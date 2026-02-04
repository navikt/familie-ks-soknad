import React, { ReactNode } from 'react';

import { PortableText } from '@portabletext/react';
import styled from 'styled-components';

import { BodyLong, BodyShort, Detail, Heading, Ingress, Label } from '@navikt/ds-react';

import { useAppContext } from '../../context/AppContext';
import { useSpråkContext } from '../../context/SpråkContext';
import { LocaleRecordBlock, Typografi } from '../../typer/common';
import { FlettefeltVerdier } from '../../typer/kontrakt/generelle';

const StyledLabel = styled(Label)`
    display: block;
`;

interface Props {
    typografi?: Typografi;
    style?: React.CSSProperties;
    children?: ReactNode;
}

const StyledBodyLong = styled(BodyLong)`
    :empty {
        height: 1.625rem;
    }
`;

export function TypografiWrapper({ typografi, style, children }: Props) {
    switch (typografi) {
        case Typografi.StegHeadingH1:
            return (
                <Heading level={'1'} size={'xsmall'} style={style}>
                    {children}
                </Heading>
            );
        case Typografi.ModalHeadingH1:
            return (
                <Heading level={'1'} size={'large'} style={style}>
                    {children}
                </Heading>
            );
        case Typografi.ForsideHeadingH1:
            return (
                <Heading level={'1'} size={'xlarge'} style={style}>
                    {children}
                </Heading>
            );
        case Typografi.HeadingH2:
            return (
                <Heading level={'2'} size={'medium'} spacing style={style}>
                    {children}
                </Heading>
            );
        case Typografi.HeadingH3:
            return (
                <Heading level={'3'} size={'small'} spacing style={style}>
                    {children}
                </Heading>
            );
        case Typografi.Ingress:
            return <Ingress style={style}>{children}</Ingress>;
        case Typografi.BodyLong:
            return (
                <StyledBodyLong as={'p'} style={style}>
                    {children}
                </StyledBodyLong>
            );
        case Typografi.BodyShort:
            return <BodyShort style={style}>{children}</BodyShort>;
        case Typografi.Label:
            return (
                <StyledLabel as={'label'} spacing style={style}>
                    {children}
                </StyledLabel>
            );
        case Typografi.Detail:
            return <Detail style={style}>{children}</Detail>;
        case undefined:
            return <div style={style}>{children}</div>;
    }
}

const TekstBlock: React.FC<{
    block: LocaleRecordBlock | undefined;
    flettefelter?: FlettefeltVerdier;
    typografi?: Typografi;
}> = ({ block, flettefelter, typografi }) => {
    const { valgtLocale } = useSpråkContext();
    const { flettefeltTilTekst } = useAppContext();

    return block ? (
        <PortableText
            value={block[valgtLocale]}
            components={{
                block: {
                    normal: ({ children }) => (
                        <TypografiWrapper typografi={typografi} style={{ minHeight: '1rem' }}>
                            {children}
                        </TypografiWrapper>
                    ),
                    h1: ({ children }) => <TypografiWrapper typografi={typografi}>{children}</TypografiWrapper>,
                    h2: ({ children }) => (
                        <TypografiWrapper typografi={Typografi.HeadingH2}>{children}</TypografiWrapper>
                    ),
                    h3: ({ children }) => (
                        <TypografiWrapper typografi={Typografi.HeadingH3}>{children}</TypografiWrapper>
                    ),
                },
                marks: {
                    flettefelt: props => {
                        if (props?.value?.flettefeltVerdi) {
                            return <span>{flettefeltTilTekst(props.value.flettefeltVerdi, flettefelter)}</span>;
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
                            >
                                {props.text}
                            </a>
                        );
                    },
                },
                types: {
                    flettefelt: props => flettefeltTilTekst(props.value.flettefelt, flettefelter, valgtLocale),
                },
            }}
        />
    ) : null;
};

export default TekstBlock;
