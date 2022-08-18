import React from 'react';

import { PortableText } from '@portabletext/react';

import { useApp } from '../../context/AppContext';
import { LocaleRecordBlock } from '../../typer/common';
import { flettefeltTilTekst } from '../../utils/språk';

const TekstBlock: React.FC<{ block: LocaleRecordBlock }> = ({ block }) => {
    const { localeBlock, localeString, tekster, søknad } = useApp();

    return (
        <PortableText
            value={localeBlock(block)}
            components={{
                marks: {
                    flettefelt: props => {
                        if (props?.value?.flettefeltVerdi) {
                            return (
                                <span>
                                    {
                                        flettefeltTilTekst(
                                            tekster().flettefelter,
                                            localeString,
                                            søknad.søker.navn
                                        )[props.value.flettefeltVerdi]
                                    }
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
