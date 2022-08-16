import React from 'react';

import { PortableText } from '@portabletext/react';

import { useApp } from '../../context/AppContext';
import { LocaleRecordBlock } from '../../typer/common';
import { flettefeltTilTekst } from '../../utils/språk';

const TekstBlock: React.FC<{ block: LocaleRecordBlock }> = ({ block }) => {
    const { localeBlock, localeString, tekster } = useApp();

    return (
        <PortableText
            value={localeBlock(block)}
            components={{
                marks: {
                    flettefelt: props => {
                        if (props?.value?.flettefeltVerdi) {
                            return (
                                <span>
                                    {localeString(
                                        flettefeltTilTekst(tekster().flettefelter)[
                                            props.value.flettefeltVerdi
                                        ]
                                    )}
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
                                href={props.value.href}
                            >
                                {props.text}
                            </a>
                        );
                    },
                },
            }}
        />
    );
};

export default TekstBlock;
