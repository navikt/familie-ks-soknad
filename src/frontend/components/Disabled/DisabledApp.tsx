import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Lenke from 'nav-frontend-lenker';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';

import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import { DekoratørenSpråkHandler } from '../Felleskomponenter/Dekoratøren/DekoratørenSpråkHandler';
import InnholdContainer from '../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledSpråkvelger = styled(Sprakvelger)`
    margin: auto auto 2rem auto;
`;

const StyledSidetittel = styled(Sidetittel)`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

export const DisabledApp: React.FC = () => {
    const { formatMessage } = useIntl();
    return (
        <main>
            <DekoratørenSpråkHandler />
            <InnholdContainer>
                {
                    // TODO: Dekoratøren språk-handling fra PR: #265
                }
                <VeilederSnakkeboble
                    tekst={<SpråkTekst id={'vedlikehold.veilederhilsen'} />}
                    posisjon={'høyre'}
                />
                <StyledSidetittel>
                    <SpråkTekst id={'vedlikehold.sidetittel'} />
                </StyledSidetittel>
                <StyledSpråkvelger støttedeSprak={[LocaleType.nb, LocaleType.nn, LocaleType.en]} />
                <Normaltekst>
                    <SpråkTekst id={'vedlikehold.brødtekst'} />
                </Normaltekst>
                <Lenke href={formatMessage({ id: 'felles.bruk-pdfskjema.lenke' })}>
                    <SpråkTekst id={'felles.bruk-pdfskjema.lenketekst'} />
                </Lenke>
            </InnholdContainer>
        </main>
    );
};
