import React, { FC, ReactNode } from 'react';

import AlertStripe from './AlertStripe/AlertStripe';
import KomponentGruppe from './KomponentGruppe/KomponentGruppe';
import TekstBlock from './TekstBlock';
import { useApp } from '../../context/AppContext';

interface Props {
    advarselTekst: ReactNode;
}

export const SøkerMåBrukePDF: FC<Props> = ({ advarselTekst }) => {
    const { tekster } = useApp();
    const { brukPDFKontantstoette } = tekster().FELLES.kanIkkeBrukeSoeknad;
    return (
        <KomponentGruppe dynamisk>
            <AlertStripe variant={'warning'}>{advarselTekst}</AlertStripe>
            <TekstBlock block={brukPDFKontantstoette} />
        </KomponentGruppe>
    );
};
