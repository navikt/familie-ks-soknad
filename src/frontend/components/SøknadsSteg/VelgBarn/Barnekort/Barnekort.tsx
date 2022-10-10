import React from 'react';

import styled from 'styled-components';

import { Checkbox } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import {
    NavdsGlobalColorGray100,
    NavdsGlobalColorPurple400,
    NavdsGlobalColorPurple800,
} from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../../context/AppContext';
import { device } from '../../../../Theme';
import { IBarn } from '../../../../typer/person';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { formaterFnr } from '../../../../utils/visning';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { TilfeldigBarnIkon } from '../../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';
import { IVelgBarnTekstinnhold } from '../innholdTyper';
import { FjernBarnKnapp } from './FjernBarnKnapp';

interface IBarnekortProps {
    velgBarnCallback: (barn: IBarn, barnMedISøknad: boolean) => void;
    barn: IBarn;
    barnSomSkalVæreMed: IBarn[];
    fjernBarnCallback: (ident: string) => void;
}

export const StyledBarnekort = styled.div`
    position: relative;
    border-radius: 0.3rem;
    max-width: calc(16.3rem - 0.3rem * 2);
    padding: 2rem;
    margin: 0 0.3125rem 0.625rem;
    background-color: ${NavdsGlobalColorGray100};
    @media all and ${device.mobile} {
        width: 100%;
    }
`;

const StyledCheckbox = styled(Checkbox)`
    margin-top: 2.75rem;
`;

const InformasjonsboksInnhold = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 8rem;
`;

const BarnekortHeader = styled.div`
    height: 8rem;
    background-color: ${NavdsGlobalColorPurple800};
    border-bottom: 0.25rem solid ${NavdsGlobalColorPurple400};
    border-radius: 0.3rem 0.3rem 0 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
`;

const StyledUndertittel = styled(Undertittel)`
    text-transform: uppercase;
    && {
        font-weight: 700;
    }
`;

const Barnekort: React.FC<IBarnekortProps> = ({
    barn,
    velgBarnCallback,
    barnSomSkalVæreMed,
    fjernBarnCallback,
}) => {
    const {
        søknad: { barnRegistrertManuelt },
        tekster,
        plainTekst,
    } = useApp();

    const teksterForSteg: IVelgBarnTekstinnhold = tekster()[ESanitySteg.VELG_BARN];
    const {
        alderLabel,
        aar,
        registrertBostedLabel,
        soekOmYtelseForBarnetSjekkboks,
        foedselsnummerLabel,
        navnErstatterForAdressesperre,
    } = teksterForSteg;

    const erMedISøknad = !!barnSomSkalVæreMed.find(barnMedISøknad => barnMedISøknad.id === barn.id);

    const erRegistrertManuelt = !!barnRegistrertManuelt.find(
        manueltRegistrertBarn => manueltRegistrertBarn.id === barn.id
    );

    return (
        <StyledBarnekort>
            <BarnekortHeader>
                <TilfeldigBarnIkon />
            </BarnekortHeader>
            <InformasjonsboksInnhold>
                <StyledUndertittel>
                    {barn.adressebeskyttelse ? (
                        <TekstBlock block={navnErstatterForAdressesperre} />
                    ) : (
                        barn.navn
                    )}
                </StyledUndertittel>
                {!barn.adressebeskyttelse && (
                    <>
                        <TekstBlock block={foedselsnummerLabel} />
                        <Normaltekst>{formaterFnr(barn.ident)}</Normaltekst>
                    </>
                )}
                {barn.alder && ( // Barn med undefined fødselsdato i pdl eller som søker har lagt inn selv har alder -null-
                    <>
                        <TekstBlock block={alderLabel} />
                        <Normaltekst>{`${barn.alder} ${plainTekst(aar)}`}</Normaltekst>
                    </>
                )}

                {!erRegistrertManuelt && (
                    <>
                        <TekstBlock block={registrertBostedLabel} />
                        <TekstBlock block={hentBostedSpråkId(barn, teksterForSteg)} />
                    </>
                )}
                <StyledCheckbox
                    checked={erMedISøknad}
                    label={<TekstBlock block={soekOmYtelseForBarnetSjekkboks} />}
                    aria-label={`${plainTekst(soekOmYtelseForBarnetSjekkboks)} ${barn.navn}`}
                    onChange={() => velgBarnCallback(barn, erMedISøknad)}
                />
            </InformasjonsboksInnhold>
            {erRegistrertManuelt && (
                <FjernBarnKnapp barnId={barn.id} fjernBarnCallback={fjernBarnCallback} />
            )}
        </StyledBarnekort>
    );
};

export default Barnekort;
