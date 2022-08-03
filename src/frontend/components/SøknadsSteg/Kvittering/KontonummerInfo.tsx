import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

export const KontonummerInfo: React.FC = () => {
    return (
        <Informasjonsbolk tittelId="kvittering.kontonummer">
            <Normaltekst>
                <SpråkTekst
                    id={'kvittering.kontonummer.innhold'}
                    values={{
                        dineSiderLenke: (
                            <EksternLenke
                                lenkeTekstSpråkId={'kvittering.kontonummer.dinesiderlenketekst'}
                                lenkeSpråkId={'kvittering.kontonummer.dinesiderlenke'}
                            />
                        ),
                    }}
                />
            </Normaltekst>
        </Informasjonsbolk>
    );
};
