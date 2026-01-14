import React from 'react';

import { Alert, Heading, Label, Loader, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useAppContext } from '../../context/AppContext';
import { Typografi } from '../../typer/common';
import { ESanitySteg } from '../../typer/sanity/sanity';
import TekstBlock from '../Felleskomponenter/TekstBlock';

const Kontoinformasjon: React.FC = () => {
    const { kontoinformasjon, tekster, plainTekst } = useAppContext();

    const kvitteringstekster = tekster()[ESanitySteg.KVITTERING];

    return (
        <VStack gap="6">
            {kontoinformasjon.status === RessursStatus.SUKSESS && (
                <>
                    <Heading level="2" size="medium">
                        {plainTekst(kvitteringstekster.kontonummerTittel)}
                    </Heading>
                    <Label as="p">{kontoinformasjon.data.kontonummer}</Label>
                    <TekstBlock typografi={Typografi.BodyLong} block={kvitteringstekster.redigerKontonummerLenke} />
                </>
            )}

            {kontoinformasjon.status === RessursStatus.HENTER && (
                <>
                    <Heading level="2" size="medium">
                        {plainTekst(kvitteringstekster.kontonummerTittel)}
                    </Heading>
                    <Loader title={plainTekst(kvitteringstekster.henterKontonummer)} />
                </>
            )}

            {kontoinformasjon.status === RessursStatus.FEILET && (
                <>
                    <Alert variant="warning">
                        <TekstBlock block={kvitteringstekster.finnerIngenKontonummerAdvarsel} />
                    </Alert>
                    <Heading level="2" size="medium">
                        {plainTekst(kvitteringstekster.manglerKontonummerTittel)}
                    </Heading>
                    <TekstBlock
                        typografi={Typografi.BodyLong}
                        block={kvitteringstekster.finnerIngenKontonummerBeskrivelse}
                    />
                </>
            )}
        </VStack>
    );
};

export default Kontoinformasjon;
