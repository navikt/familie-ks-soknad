import React, { ReactNode } from 'react';

import { useAppContext } from '../../../context/AppContext';
import { muligeSlektsforhold } from '../../../typer/barn';
import { Slektsforhold } from '../../../typer/kontrakt/generelle';
import { hentSlektsforhold } from '../../../utils/språk';

import StyledDropdown, { StyledDropdownProps } from './StyledDropdown';

export interface SlektsforholdDropdownProps extends StyledDropdownProps<Slektsforhold | ''> {
    gjelderSøker?: boolean;
}

const SlektsforholdDropdown: React.FC<SlektsforholdDropdownProps> = ({
    gjelderSøker = false,
    ...props
}) => {
    const { plainTekst, tekster } = useAppContext();
    const aktuelleSlektsforhold = gjelderSøker
        ? muligeSlektsforhold
        : muligeSlektsforhold.filter(slektsforhold => slektsforhold !== Slektsforhold.FORELDER);
    return (
        <StyledDropdown<Slektsforhold | ''> {...props}>
            {aktuelleSlektsforhold.map(
                (slektsforhold: Slektsforhold): ReactNode => (
                    <option value={slektsforhold} key={slektsforhold}>
                        {plainTekst(hentSlektsforhold(slektsforhold, tekster().EØS_FOR_BARN))}
                    </option>
                )
            )}
        </StyledDropdown>
    );
};

export default SlektsforholdDropdown;
