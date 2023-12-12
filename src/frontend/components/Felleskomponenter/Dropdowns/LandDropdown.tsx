import React, { ReactNode } from 'react';

import { Alpha3Code, getAlpha3Codes, getName } from 'i18n-iso-countries';

import { Felt, ISkjema } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { SkjemaFeltTyper } from '../../../typer/skjema';

import StyledDropdown from './StyledDropdown';

interface LandDropdownProps {
    felt: Felt<Alpha3Code | ''>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    label?: ReactNode;
    dynamisk?: boolean;
    kunEøs?: boolean;
    ekskluderNorge?: boolean;
}

export const LandDropdown: React.FC<LandDropdownProps> = props => {
    const { tekster, plainTekst } = useApp();
    const [valgtLocale] = useSprakContext();
    const { erEøsLand } = useEøs();
    const kunEøs = props.kunEøs ?? false;

    const landkoderSortertPåNavn = Object.keys(getAlpha3Codes())
        .sort((a, b) => {
            const landA = getName(a, valgtLocale);
            const landB = getName(b, valgtLocale);
            if (landA && landB) {
                return landA >= landB ? 1 : -1;
            }
            return 0;
        })
        .filter(landKode => (kunEøs ? erEøsLand(landKode as Alpha3Code) : true))
        .filter(landKode => (props.ekskluderNorge ? landKode !== 'NOR' : true));

    return (
        <StyledDropdown<Alpha3Code | ''>
            placeholder={plainTekst(tekster().FELLES.hjelpeteksterForInput.velgLandPlaceholder)}
            {...props}
        >
            {landkoderSortertPåNavn.map(
                (alphaCode): ReactNode => (
                    <option value={alphaCode} key={alphaCode}>
                        {getName(alphaCode, valgtLocale)}
                    </option>
                )
            )}
        </StyledDropdown>
    );
};
