import React from 'react';

import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { eøsBarnSpørsmålSpråkId } from '../../../EøsSteg/Barn/spørsmål';

export const tittelSpmEøsBarnOppsummering = (spørsmålId: string, barnetsNavn: string) => (
    <SpråkTekst id={eøsBarnSpørsmålSpråkId[spørsmålId]} values={{ barn: barnetsNavn }} />
);
