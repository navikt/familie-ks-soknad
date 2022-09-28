import React from 'react';

import { isPortableTextBlock, isPortableTextSpan } from '@portabletext/toolkit';
import { PortableTextBlock } from '@portabletext/types';
import { pipe } from 'ramda';

import { EFlettefeltverdi } from '../typer/sanity/sanity';

export const toPlainTextHof =
    flettefeltTilTekst =>
    (block: PortableTextBlock, barnetsNavn?: string): string => {
        const leadingSpace = /^\s/;
        const trailingSpace = /^\s/;

        const blocks = Array.isArray(block) ? block : [block];
        let text = '';

        const options = {
            components: {
                marks: {
                    flettefelt: ({ text }) => {
                        if (text) {
                            return (
                                <span>
                                    {flettefeltTilTekst(text as EFlettefeltverdi, barnetsNavn)}
                                </span>
                            );
                        } else {
                            throw new Error(`Fant ikke flettefeltVerdi`);
                        }
                    },
                },
            },
        };

        blocks.forEach((current, index) => {
            if (!isPortableTextBlock(current)) {
                return;
            }

            let pad = false;
            current.children.forEach(span => {
                if (isPortableTextSpan(span)) {
                    // If the previous element was a non-span, and we have no natural whitespace
                    // between the previous and the next span, insert it to give the spans some
                    // room to breathe. However, don't do so if this is the first span.
                    text +=
                        pad && text && !trailingSpace.test(text) && !leadingSpace.test(span.text)
                            ? ' '
                            : '';

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const markTransformers = span.marks.map(name => node => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const markDef = current.markDefs.find(({ _key }) => _key === name);
                        const span =
                            options?.components?.marks?.[name] ??
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            options?.components?.marks?.[markDef?._type];

                        return span
                            ? {
                                  ...node,
                                  text: span({
                                      ...node,
                                      value: markDef,
                                  }),
                              }
                            : node;
                    });

                    text += pipe(node => node, ...markTransformers)(span).text;
                    pad = false;
                } else {
                    pad = true;
                }
            });

            if (index !== blocks.length - 1) {
                text += '\n\n';
            }
        });

        return text;
    };
