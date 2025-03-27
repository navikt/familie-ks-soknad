import React from 'react';

import { BodyShort, Button } from '@navikt/ds-react';

import { useAppContext } from '../../../../context/AppContext';
import { ILeggTilBarnTekstinnhold } from '../../../../typer/sanity/modaler/leggTilBarn';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { BarnekortContainer } from '../Barnekort/BarnekortContainer';
import { IVelgBarnTekstinnhold } from '../innholdTyper';

export const NyttBarnKort: React.FC<{ onLeggTilBarn: () => void }> = ({ onLeggTilBarn }) => {
    const { tekster } = useAppContext();
    const teksterForSteg: IVelgBarnTekstinnhold = tekster()[ESanitySteg.VELG_BARN];
    const teksterForLeggTilBarnModal: ILeggTilBarnTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.leggTilBarn;
    const { soekeForUregistrerteBarn } = teksterForSteg;

    return (
        <BarnekortContainer>
            <BodyShort spacing>
                <TekstBlock block={soekeForUregistrerteBarn} />
            </BodyShort>
            <Button type="button" variant="secondary" onClick={() => onLeggTilBarn()}>
                <TekstBlock block={teksterForLeggTilBarnModal.leggTilKnapp} />
            </Button>
        </BarnekortContainer>
    );
};
