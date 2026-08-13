import { Box } from '@navikt/ds-react';
import { type ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import type { FC, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { FlettefeltVerdier } from '../../../../common/typer/kontrakt/generelle';
import { useAppContext } from '../../../context/AppContext';
import type { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import type { SkjemaFeltTyper } from '../../../typer/skjema';
import TekstBlock from '../TekstBlock';

interface IJaNeiSpmProps {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    felt: Felt<ESvar | null>;
    tilleggsinfo?: ReactNode;
    inkluderVetIkke?: boolean;
    spørsmålDokument: ISanitySpørsmålDokument;
    flettefelter?: FlettefeltVerdier;
}

const JaNeiSpm: FC<IJaNeiSpmProps> = ({
    skjema,
    felt,
    tilleggsinfo,
    inkluderVetIkke = false,
    spørsmålDokument,
    flettefelter,
}) => {
    const { tekster, plainTekst } = useAppContext();
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
                        {tilleggsinfo && <Box marginBlock="space-8 space-0">{tilleggsinfo}</Box>}
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
