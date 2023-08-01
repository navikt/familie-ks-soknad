import React from 'react';

import styled from 'styled-components';

import { Alert, Checkbox, Heading } from '@navikt/ds-react';
import { AGray100, APurple400, APurple800 } from '@navikt/ds-tokens/dist/tokens';

import { FjernBarnKnapp } from './FjernBarnKnapp';
import { useApp } from '../../../../context/AppContext';
import { device } from '../../../../Theme';
import { IBarn } from '../../../../typer/person';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { formaterFnr } from '../../../../utils/visning';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { TilfeldigBarnIkon } from '../../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';
import { OppsummeringFelt } from '../../Oppsummering/OppsummeringFelt';
import { IVelgBarnTekstinnhold } from '../innholdTyper';

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
    background-color: ${AGray100};
    @media all and ${device.mobile} {
        width: 100%;
        max-width: none;
        margin: 0 0 0.625rem;
    }
`;

const StyledCheckbox = styled(Checkbox)`
    margin-top: 1.75rem;
`;

const InformasjonsboksInnhold = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 8rem;
`;

const BarnekortHeader = styled.div`
    height: 8rem;
    background-color: ${APurple800};
    border-bottom: 0.25rem solid ${APurple400};
    border-radius: 0.3rem 0.3rem 0 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
`;

const StyledHeading = styled(Heading)`
    text-transform: uppercase;
    margin-bottom: 1rem;
`;

const StyledWarningAlert = styled(Alert)`
    margin-top: 1.5rem;
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
        under1Aar,
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
                <StyledHeading size={'xsmall'} level={'2'}>
                    {barn.adressebeskyttelse ? (
                        <TekstBlock block={navnErstatterForAdressesperre} />
                    ) : (
                        barn.navn
                    )}
                </StyledHeading>
                {!barn.adressebeskyttelse && (
                    <OppsummeringFelt
                        spørsmålstekst={foedselsnummerLabel}
                        søknadsvar={formaterFnr(barn.ident)}
                    />
                )}
                {barn.alder && ( // Barn med undefined fødselsdato i pdl eller som søker har lagt inn selv har alder -null-
                    <OppsummeringFelt
                        spørsmålstekst={alderLabel}
                        søknadsvar={`${barn.alder} ${plainTekst(aar)}`}
                    />
                )}

                {!erRegistrertManuelt && (
                    <OppsummeringFelt
                        spørsmålstekst={registrertBostedLabel}
                        søknadsvar={<TekstBlock block={hentBostedSpråkId(barn, teksterForSteg)} />}
                    />
                )}
                <StyledCheckbox
                    checked={erMedISøknad}
                    aria-label={`${plainTekst(soekOmYtelseForBarnetSjekkboks)} ${barn.navn}`}
                    onChange={() => velgBarnCallback(barn, erMedISøknad)}
                    data-testid={'velg-barn-checkbox'}
                >
                    <TekstBlock block={soekOmYtelseForBarnetSjekkboks} />
                </StyledCheckbox>
                {erMedISøknad && barn.erUnder11Mnd && (
                    <StyledWarningAlert inline variant={'warning'}>
                        <TekstBlock block={under1Aar} />
                    </StyledWarningAlert>
                )}
            </InformasjonsboksInnhold>
            {erRegistrertManuelt && (
                <FjernBarnKnapp barnId={barn.id} fjernBarnCallback={fjernBarnCallback} />
            )}
        </StyledBarnekort>
    );
};

export default Barnekort;
