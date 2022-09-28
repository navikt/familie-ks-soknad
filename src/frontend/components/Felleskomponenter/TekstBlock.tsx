import React from 'react';

import { PortableText } from '@portabletext/react';

import { LocaleType } from '@navikt/familie-sprakvelger';

import { useApp } from '../../context/AppContext';
import { LocaleRecordBlock } from '../../typer/common';

const TekstBlock: React.FC<{
    block: LocaleRecordBlock | undefined;
    barnetsNavn?: string;
    spesifisertLocale?: LocaleType;
}> = ({ block, barnetsNavn, spesifisertLocale }) => {
    const { localeBlock, flettefeltTilTekst } = useApp();

    return block ? (
        <PortableText
            value={spesifisertLocale ? block[spesifisertLocale] : localeBlock(block)}
            components={{
                marks: {
                    flettefelt: props => {
                        if (props?.value?.flettefeltVerdi) {
                            return (
                                <span>
                                    {flettefeltTilTekst(props.value.flettefeltVerdi, barnetsNavn)}
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
