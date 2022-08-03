import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';

import { muligeSlektsforhold } from '../../../typer/barn';
import { Slektsforhold } from '../../../typer/kontrakt/generelle';
import { toSlektsforholdSpråkId } from '../../../utils/språk';
import StyledDropdown, { StyledDropdownProps } from './StyledDropdown';

export interface SlektsforholdDropdownProps extends StyledDropdownProps<Slektsforhold | ''> {
    gjelderSøker?: boolean;
}

const SlektsforholdDropdown: React.FC<SlektsforholdDropdownProps> = ({
    gjelderSøker = false,
    ...props
}) => {
    const intl = useIntl();
    const aktuelleSlektsforhold = gjelderSøker
        ? muligeSlektsforhold
        : muligeSlektsforhold.filter(slektsforhold => slektsforhold !== Slektsforhold.FORELDER);
    return (
        <StyledDropdown<Slektsforhold | ''> {...props} bredde={'fullbredde'}>
            {aktuelleSlektsforhold.map(
                (slektsforhold): ReactNode => (
                    <option value={slektsforhold} key={slektsforhold}>
                        {intl.formatMessage({ id: toSlektsforholdSpråkId(slektsforhold) })}
                    </option>
                )
            )}
        </StyledDropdown>
    );
};

export default SlektsforholdDropdown;
