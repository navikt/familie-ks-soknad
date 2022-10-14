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

const typografiWrapper = (content: JSX.Element, typografi?: Typografi): JSX.Element => {
    switch (typografi) {
        case Typografi.StegHeadingH1:
            return (
                <Heading level={'1'} size={'xsmall'}>
                    {content}
                </Heading>
            );
        case Typografi.ModalHeadingH1:
            return (
                <Heading level={'1'} size={'large'}>
                    {content}
                </Heading>
            );
        case Typografi.ForsideHeadingH1:
            return (
                <Heading level={'1'} size={'xlarge'}>
                    {content}
                </Heading>
            );
        case Typografi.Ingress:
            return <Ingress>{content}</Ingress>;
        case Typografi.BodyLong:
            return <BodyLong>{content}</BodyLong>;
        case Typografi.BodyShort:
            return <BodyShort>{content}</BodyShort>;
        case Typografi.Label:
            return <StyledLabel>{content}</StyledLabel>;
        case Typografi.Detail:
            return <Detail>{content}</Detail>;
        case Typografi.ErrorMessage:
            return <ErrorMessage>{content}</ErrorMessage>;
        case undefined:
            return <>{content}</>;
    }
};

const TekstBlock: React.FC<{
    block: LocaleRecordBlock | undefined;
    flettefelter?: FlettefeltVerdier;
    typografi?: Typografi;
}> = ({ block, flettefelter, typografi }) => {
    const [valgtLocale] = useSprakContext();
    const { flettefeltTilTekst } = useApp();

    return block
        ? typografiWrapper(
              <PortableText
                  value={block[valgtLocale]}
                  components={{
                      block: {
                          normal: ({ children }) => <>{children}</>,
                          h1: ({ children }) => <>{children}</>,
                      },
                      marks: {
                          flettefelt: props => {
                              if (props?.value?.flettefeltVerdi) {
                                  return (
                                      <span>
                                          {flettefeltTilTekst(
                                              props.value.flettefeltVerdi,
                                              flettefelter
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
                                      href={encodeURI(props.value.href)}
                                      style={{ display: 'inline-block' }}
                                  >
                                      {props.text}
                                  </a>
                              );
                          },
                      },
                  }}
              />,
              typografi
          )
        : null;
};

export default TekstBlock;
