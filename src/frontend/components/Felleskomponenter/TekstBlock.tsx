import React from 'react';

import { PortableText } from '@portabletext/react';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../context/AppContext';
import { LocaleRecordBlock } from '../../typer/common';

const TekstBlock: React.FC<{
    block: LocaleRecordBlock | undefined;
    barnetsNavn?: string;
}> = ({ block, barnetsNavn }) => {
    const [valgtLocale] = useSprakContext();
    const { flettefeltTilTekst } = useApp();

    return block ? (
        <PortableText
            value={block[valgtLocale]}
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
