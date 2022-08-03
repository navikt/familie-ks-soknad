import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Checkbox } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import useFørsteRender from '../../../hooks/useFørsteRender';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledCheckbox = styled(Checkbox)`
    margin-top: 1rem;
`;

export const SkjemaCheckbox: React.FC<{
    felt: Felt<ESvar>;
    visFeilmeldinger?: boolean;
    labelSpråkTekstId: string;
    språkVerdier?: { [key: string]: ReactNode };
}> = ({ felt, visFeilmeldinger = false, labelSpråkTekstId, språkVerdier }) => {
    useFørsteRender(() => {
        felt.validerOgSettFelt(felt.verdi);
    });

    const onChange = event => {
        const { onChange: feltOnChange } = felt.hentNavInputProps(false);
        feltOnChange(event.target.checked ? ESvar.JA : ESvar.NEI);
    };

    return felt.erSynlig ? (
        <StyledCheckbox
            checked={felt.verdi === ESvar.JA}
            {...felt.hentNavInputProps(visFeilmeldinger)}
            label={<SpråkTekst id={labelSpråkTekstId} values={språkVerdier} />}
            onChange={onChange}
        />
    ) : null;
};
