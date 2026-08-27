import { useTranslateFlettefelt } from '@hooks/useTranslateFlettefelt';
import { BodyLong, BodyShort, Detail, Heading, Ingress, Label } from '@navikt/ds-react';
import { PortableText } from '@portabletext/react';
import type { CSSProperties, ReactNode } from 'react';
import type { FlettefeltVerdier } from '../../../common/typer/kontrakt/generelle';
import type { LocaleRecordBlock } from '../../../common/typer/locale';
import { useSpråkContext } from '../../context/SpråkContext';
import { Typografi } from '../../typer/common';

import styles from './TekstBlock.module.css';

interface Props {
    typografi?: Typografi;
    style?: CSSProperties;
    children?: ReactNode;
}

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
                <BodyLong as={'p'} style={style} className={styles.bodyLong}>
                    {children}
                </BodyLong>
            );
        case Typografi.BodyShort:
            return <BodyShort style={style}>{children}</BodyShort>;
        case Typografi.Label:
            return (
                <Label as={'label'} spacing style={style} className={styles.label}>
                    {children}
                </Label>
            );
        case Typografi.Detail:
            return <Detail style={style}>{children}</Detail>;
        case undefined:
            return <div style={style}>{children}</div>;
    }
}

function TekstBlock({
    block,
    flettefelter,
    typografi,
}: {
    block: LocaleRecordBlock | undefined;
    flettefelter?: FlettefeltVerdier;
    typografi?: Typografi;
}) {
    const { valgtLocale } = useSpråkContext();
    const translateFlettefelt = useTranslateFlettefelt();

    if (!block) {
        return null;
    }

    return (
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
                            return <span>{translateFlettefelt(props.value.flettefeltVerdi, flettefelter)}</span>;
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
                    flettefelt: props => translateFlettefelt(props.value.flettefelt, flettefelter, valgtLocale),
                },
            }}
        />
    );
}

export default TekstBlock;
