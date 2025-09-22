import React, { FC } from 'react';

import { List } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { dokumentasjonsbehovTilTittelSanityApiNavn } from '../../../typer/dokumentasjon';

import { hentVedleggSomSkalVises } from './vedleggOppsummering.domene';
import { IVedleggOppsummering } from './vedleggOppsummering.types';

interface IVedleggOppsummeringProps {
    vedlegg: IVedleggOppsummering[];
}

export const VedleggOppsummering: FC<IVedleggOppsummeringProps> = ({ vedlegg }) => {
    const { tekster, plainTekst } = useAppContext();
    const dokumentasjonTekster = tekster().DOKUMENTASJON;
    const vedleggSomSkalVises = hentVedleggSomSkalVises(vedlegg);

    return (
        <>
            {vedleggSomSkalVises.length > 0 && (
                <List>
                    {vedleggSomSkalVises.map((vedlegg, index) => (
                        <List.Item key={index}>
                            {plainTekst(
                                dokumentasjonTekster[
                                    dokumentasjonsbehovTilTittelSanityApiNavn(vedlegg.dokumentasjonsbehov)
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
