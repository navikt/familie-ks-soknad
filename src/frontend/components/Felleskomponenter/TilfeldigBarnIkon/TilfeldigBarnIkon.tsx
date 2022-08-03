import React, { useState } from 'react';

import Barn1 from '../../../assets/Barn1';
import Barn2 from '../../../assets/Barn2';
import Barn3 from '../../../assets/Barn3';
import { randomIntFraIntervall } from '../../../utils/hjelpefunksjoner';

export const TilfeldigBarnIkon: React.FC<{ byttVedRerender?: boolean }> = ({
    byttVedRerender = true,
}) => {
    const ikoner: JSX.Element[] = [<Barn1 />, <Barn2 />, <Barn3 />];
    // Bruker callback istedenfor direkte verdi slik at vi kun kaller randomIntFraIntervall ved første render
    const [fastsattIkonIndex] = useState<number>(() => randomIntFraIntervall(0, ikoner.length - 1));

    return (
        <>
            {byttVedRerender
                ? ikoner[randomIntFraIntervall(0, ikoner.length - 1)]
                : ikoner[fastsattIkonIndex]}
        </>
    );
};
