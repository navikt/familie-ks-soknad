import React, { PropsWithChildren, ReactNode } from 'react';

import { Select } from 'nav-frontend-skjema';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';

export interface StyledDropdownProps<ConstrainedString extends string> {
    felt: Felt<ConstrainedString>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    placeholder: string;
    label?: ReactNode;
    dynamisk?: boolean;
    bredde?: 'fullbredde' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs';
}

const StyledDropdown = <ConstrainedString extends string>({
    children,
    felt,
    skjema,
    placeholder,
    label,
    dynamisk = false,
    bredde,
}: PropsWithChildren<StyledDropdownProps<ConstrainedString>>) =>
    felt.erSynlig ? (
        <div id={felt.id} aria-live={dynamisk ? 'polite' : 'off'}>
            <Select
                label={label}
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                id={undefined}
                bredde={bredde || 'l'}
            >
                <option disabled={true} value={''}>
                    {placeholder}
                </option>
                {children}
                <optgroup
                    label="" /* En tom optgroup hindrer teksten i dropdown på ios å bli truncated */
                />
            </Select>
        </div>
    ) : null;

export default StyledDropdown;
