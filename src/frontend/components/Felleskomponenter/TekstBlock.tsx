import React from 'react';

import { PortableText } from '@portabletext/react';

import { useApp } from '../../context/AppContext';
import { LocaleRecordBlock } from '../../typer/common';
import { EFlettefeltverdi, ESanitySteg } from '../../typer/sanity/sanity';

const TekstBlock: React.FC<{ block: LocaleRecordBlock | undefined; barnetsNavn?: string }> = ({
    block,
    barnetsNavn,
}) => {
    const { localeBlock, localeString, tekster, søknad } = useApp();

    const flettefeltTilTekst = (flettefeltVerdi: EFlettefeltverdi): string => {
        switch (flettefeltVerdi) {
            case EFlettefeltverdi.SØKER_NAVN:
                return søknad.søker.navn;
            case EFlettefeltverdi.BARN_NAVN:
                return barnetsNavn ?? '';
            case EFlettefeltverdi.YTELSE:
                return localeString(tekster()[ESanitySteg.FELLES].frittståendeOrd.kontantstoette);
            default:
                return '';
        }
    };

    return block ? (
        <PortableText
            value={localeBlock(block)}
            components={{
                marks: {
                    flettefelt: props => {
                        if (props?.value?.flettefeltVerdi) {
                            return <span>{flettefeltTilTekst(props.value.flettefeltVerdi)}</span>;
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
