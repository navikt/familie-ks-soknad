import React from 'react';

import { Box, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { TilfeldigBarnIkon } from '../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

import styles from './OmBarnetHeader.module.css';

export const OmBarnetHeader: React.FC<{ barn: IBarnMedISøknad }> = ({ barn }) => {
    const {
        søknad: { barnInkludertISøknaden },
        tekster,
    } = useAppContext();
    const barnIndex = barnInkludertISøknaden.findIndex(b => b.id === barn.id);

    return (
        <VStack marginBlock={'space-0 space-32'} align={'center'}>
            <TilfeldigBarnIkon byttVedRerender={false} />
            <hr className={styles.divider} />
            <Box padding={'space-16'} data-testid={barn.id}>
                <TekstBlock
                    block={tekster()[ESanitySteg.OM_BARNET].barnXAvY}
                    flettefelter={{
                        antall: (barnIndex + 1).toString(),
                        totalAntall: barnInkludertISøknaden.length.toString(),
                    }}
                    typografi={Typografi.HeadingH2}
                />
            </Box>
        </VStack>
    );
};
