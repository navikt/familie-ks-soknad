import React, { FC, ReactNode } from 'react';

import styled from 'styled-components';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import AlertStripe from './AlertStripe/AlertStripe';
import EksternLenke from './EksternLenke/EksternLenke';
import Informasjonsbolk from './Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from './SpråkTekst/SpråkTekst';

interface Props {
    advarselTekst: ReactNode;
    utfyllendeAdvarselInfoId?: string;
}

const LenkeContainer = styled.div`
    margin: 1.75rem 0;
`;

export const SøkerMåBrukePDF: FC<Props> = ({ advarselTekst, utfyllendeAdvarselInfoId }) => {
    return (
        <Informasjonsbolk aria-live={'polite'}>
            <AlertStripe variant={'warning'}>{advarselTekst}</AlertStripe>
            {utfyllendeAdvarselInfoId && (
                <Informasjonsbolk>
                    <Element>
                        <SpråkTekst id={utfyllendeAdvarselInfoId} />
                    </Element>
                </Informasjonsbolk>
            )}
            <LenkeContainer>
                <EksternLenke
                    lenkeSpråkId={'felles.bruk-pdfskjema.lenke'}
                    lenkeTekstSpråkId={'felles.bruk-pdfskjema.lenketekst'}
                />
            </LenkeContainer>
            <Normaltekst>
                <SpråkTekst id={'felles.sende-skjema.info'} />
            </Normaltekst>
        </Informasjonsbolk>
    );
};
