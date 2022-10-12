import React, { ReactNode } from 'react';

import { Input, InputProps } from 'nav-frontend-skjema';

import { Felt } from '@navikt/familie-skjema';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface SkjemaFeltInputProps extends InputProps {
    // eslint-disable-next-line
    felt: Felt<any>;
    visFeilmeldinger: boolean;
    /** @deprecated **/
    labelSpråkTekstId?: string;
    label?: ReactNode;
    språkValues?: Record<string, ReactNode>;
    tilleggsinfo?: ReactNode;
    bredde?: 'fullbredde' | 'XXL' | 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS';
}

/**
 * Henter input props fra felt, og fra props. Props overstyrer felt.
 */
export const SkjemaFeltInput: React.FC<SkjemaFeltInputProps> = props => {
    const {
        felt,
        labelSpråkTekstId,
        label,
        visFeilmeldinger,
        språkValues,
        tilleggsinfo,
        bredde,
        ...øvrigePropsStøttetAvNavInput
    } = props;
    const navInputPropsFraFeltHook = felt.hentNavInputProps(visFeilmeldinger);

    return felt.erSynlig ? (
        <div>
            <Input
                label={
                    labelSpråkTekstId ? (
                        <SpråkTekst id={labelSpråkTekstId} values={språkValues} />
                    ) : (
                        label
                    )
                }
                description={tilleggsinfo}
                {...navInputPropsFraFeltHook}
                {...øvrigePropsStøttetAvNavInput}
                maxLength={500}
                bredde={bredde}
            />
        </div>
    ) : null;
};
