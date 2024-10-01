import React, { FC, ReactNode } from 'react';

import { Alert } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';

import KomponentGruppe from './KomponentGruppe/KomponentGruppe';
import TekstBlock from './TekstBlock';

interface Props {
    advarselTekst: ReactNode;
}

export const SøkerMåBrukePDF: FC<Props> = ({ advarselTekst }) => {
    const { tekster } = useApp();
    const { brukPDFKontantstoette } = tekster().FELLES.kanIkkeBrukeSoeknad;
    return (
        <KomponentGruppe dynamisk>
            <Alert variant={'warning'}>{advarselTekst}</Alert>
            <TekstBlock block={brukPDFKontantstoette} />
        </KomponentGruppe>
    );
};
