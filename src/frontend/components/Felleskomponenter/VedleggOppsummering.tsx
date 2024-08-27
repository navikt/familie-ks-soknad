import React, { FC } from 'react';

import { Alert, List } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import { dokumentasjonsbehovTilTittelSanityApiNavn } from '../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../typer/kontrakt/dokumentasjon';

interface IVedleggOppsummeringProps {
    vedlegg: {
        skalVises: boolean;
        dokumentasjonsbehov: Dokumentasjonsbehov;
    }[];
}

export const VedleggOppsummering: FC<IVedleggOppsummeringProps> = ({ vedlegg }) => {
    const { tekster, plainTekst } = useApp();

    const dokumentasjonTekster = tekster().DOKUMENTASJON;

    const vedleggSomSkalVises = vedlegg.filter(vedlegg => vedlegg.skalVises);

    return (
        <>
            {vedleggSomSkalVises.length > 0 && (
                <Alert variant="info">
                    {plainTekst(dokumentasjonTekster.lastOppSenereISoknad)}
                    <List>
                        {vedleggSomSkalVises.map((vedlegg, index) => (
                            <List.Item key={index}>
                                {plainTekst(
                                    dokumentasjonTekster[
                                        dokumentasjonsbehovTilTittelSanityApiNavn(
                                            vedlegg.dokumentasjonsbehov
                                        )
                                    ]
                                )}
                            </List.Item>
                        ))}
                    </List>
                </Alert>
            )}
        </>
    );
};
