import React, { ReactNode } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { Box } from '@navikt/ds-react';
import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import TekstBlock from '../TekstBlock';

interface IJaNeiSpmProps {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    felt: Felt<ESvar | null>;
    tilleggsinfo?: ReactNode;
    inkluderVetIkke?: boolean;
    spørsmålDokument: ISanitySpørsmålDokument;
    flettefelter?: FlettefeltVerdier;
}

const JaNeiSpm: React.FC<IJaNeiSpmProps> = ({
    skjema,
    felt,
    tilleggsinfo,
    inkluderVetIkke = false,
    spørsmålDokument,
    flettefelter,
}) => {
    const { tekster, plainTekst } = useApp();
    const { ja, nei, jegVetIkke } = tekster().FELLES.frittståendeOrd;

    return felt.erSynlig ? (
        <div id={felt.id} data-testid={felt.id}>
            <JaNeiSpørsmål
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                initiellVerdi={felt.verdi}
                name={uuidv4()}
                size={'medium'}
                error={felt.hentNavInputProps(skjema.visFeilmeldinger).feil}
                legend={
                    <>
                        <TekstBlock block={spørsmålDokument.sporsmal} flettefelter={flettefelter} />
                        {tilleggsinfo && <Box marginBlock="2 0">{tilleggsinfo}</Box>}
                    </>
                }
                labelTekstForRadios={{
                    ja: plainTekst(ja),
                    nei: plainTekst(nei),
                    vetikke: inkluderVetIkke ? plainTekst(jegVetIkke) : undefined,
                }}
            />
        </div>
    ) : null;
};

export default JaNeiSpm;
