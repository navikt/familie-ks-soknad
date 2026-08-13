import { InlineMessage } from '@navikt/ds-react';
import React, { type FC, type ReactNode } from 'react';

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
            <InlineMessage status={'warning'}>{advarselTekst}</InlineMessage>
            <TekstBlock block={brukPDFKontantstoette} />
        </KomponentGruppe>
    );
};
