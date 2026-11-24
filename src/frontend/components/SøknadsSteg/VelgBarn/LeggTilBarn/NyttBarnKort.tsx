import TekstBlock from '@components/Felleskomponenter/TekstBlock';
import type { IVelgBarnTekstinnhold } from '@components/SøknadsSteg/VelgBarn/innholdTyper';
import { useAppContext } from '@context/AppContext';
import { BodyShort, Box, Button } from '@navikt/ds-react';
import type { ILeggTilBarnTekstinnhold } from '@typer/sanity/modaler/leggTilBarn';
import { ESanitySteg } from '@typer/sanity/sanity';
import type { FC } from 'react';

export const NyttBarnKort: FC<{ onLeggTilBarn: () => void }> = ({ onLeggTilBarn }) => {
    const { tekster } = useAppContext();
    const teksterForSteg: IVelgBarnTekstinnhold = tekster()[ESanitySteg.VELG_BARN];
    const teksterForLeggTilBarnModal: ILeggTilBarnTekstinnhold = tekster()[ESanitySteg.FELLES].modaler.leggTilBarn;
    const { soekeForUregistrerteBarn } = teksterForSteg;

    return (
        <Box padding="space-24" background={'sunken'} borderRadius="4">
            <BodyShort spacing>
                <TekstBlock block={soekeForUregistrerteBarn} />
            </BodyShort>
            <Button type="button" variant="secondary" onClick={() => onLeggTilBarn()}>
                <TekstBlock block={teksterForLeggTilBarnModal.leggTilKnapp} />
            </Button>
        </Box>
    );
};
