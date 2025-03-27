import React, { FC, ReactNode } from 'react';

import { Alert } from '@navikt/ds-react';

import { useAppContext } from '../../context/AppContext';

import KomponentGruppe from './KomponentGruppe/KomponentGruppe';
import TekstBlock from './TekstBlock';

interface Props {
    advarselTekst: ReactNode;
}

export const SøkerMåBrukePDF: FC<Props> = ({ advarselTekst }) => {
    const { tekster } = useAppContext();
    const { brukPDFKontantstoette } = tekster().FELLES.kanIkkeBrukeSoeknad;
    return (
        <KomponentGruppe dynamisk>
            <Alert variant={'warning'} inline>
                {advarselTekst}
            </Alert>
            <TekstBlock block={brukPDFKontantstoette} />
        </KomponentGruppe>
    );
};
