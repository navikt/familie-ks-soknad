import React, { FC } from 'react';

import { List } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import { dokumentasjonsbehovTilTittelSanityApiNavn } from '../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../typer/kontrakt/dokumentasjon';
import { FlettefeltVerdier } from '../../typer/kontrakt/generelle';

export interface IVedleggOppsummeringProps {
    vedlegg: {
        skalVises: boolean;
        dokumentasjonsbehov: Dokumentasjonsbehov;
        flettefeltVerdier?: FlettefeltVerdier;
    }[];
}

export const VedleggOppsummering: FC<IVedleggOppsummeringProps> = ({ vedlegg }) => {
    const { tekster, plainTekst } = useApp();

    const dokumentasjonTekster = tekster().DOKUMENTASJON;

    const vedleggSomSkalVises = vedlegg.filter(vedlegg => vedlegg.skalVises);

    return (
        <>
            {vedleggSomSkalVises.length > 0 && (
                <List>
                    {vedleggSomSkalVises.map((vedlegg, index) => (
                        <List.Item key={index}>
                            {plainTekst(
                                dokumentasjonTekster[
                                    dokumentasjonsbehovTilTittelSanityApiNavn(
                                        vedlegg.dokumentasjonsbehov
                                    )
                                ],
                                vedlegg.flettefeltVerdier
                            )}
                        </List.Item>
                    ))}
                </List>
            )}
        </>
    );
};
