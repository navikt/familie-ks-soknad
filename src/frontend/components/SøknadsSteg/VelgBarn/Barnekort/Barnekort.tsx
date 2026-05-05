import React from 'react';

import { ExclamationmarkTriangleIcon, TrashFillIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, FormSummary, InfoCard } from '@navikt/ds-react';

import { useAppContext } from '../../../../context/AppContext';
import { LocaleRecordBlock } from '../../../../typer/common';
import { IBarn } from '../../../../typer/person';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { formaterFnr, uppercaseFørsteBokstav } from '../../../../utils/visning';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { IVelgBarnTekstinnhold } from '../innholdTyper';

interface IBarnekortProps {
    velgBarnCallback: (barn: IBarn, barnMedISøknad: boolean) => void;
    barn: IBarn;
    barnSomSkalVæreMed: IBarn[];
    fjernBarnCallback: (ident: string) => void;
}

const Barnekort: React.FC<IBarnekortProps> = ({ barn, velgBarnCallback, barnSomSkalVæreMed, fjernBarnCallback }) => {
    const {
        søknad: { barnRegistrertManuelt },
        tekster,
        plainTekst,
    } = useAppContext();

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

    const fødselsnummerTekst = !barn.adressebeskyttelse
        ? formaterFnr(barn.ident)
        : uppercaseFørsteBokstav(plainTekst(tekster()[ESanitySteg.FELLES].frittståendeOrd.skjult));

    const knappetekst: LocaleRecordBlock = tekster()[ESanitySteg.FELLES].modaler.leggTilBarn.fjernKnapp;

    return (
        <FormSummary.Answer>
            <FormSummary.Label>
                {barn.adressebeskyttelse ? <TekstBlock block={navnErstatterForAdressesperre} /> : barn.navn}
            </FormSummary.Label>
            <FormSummary.Value>
                <FormSummary.Answers>
                    <FormSummary.Answer>
                        <FormSummary.Label>{<TekstBlock block={foedselsnummerLabel} />}</FormSummary.Label>
                        <FormSummary.Value>{fødselsnummerTekst}</FormSummary.Value>
                    </FormSummary.Answer>
                    {barn.alder && ( // Barn med undefined fødselsdato i pdl eller som søker har lagt inn selv har alder -null-
                        <FormSummary.Answer>
                            <FormSummary.Label>{<TekstBlock block={alderLabel} />}</FormSummary.Label>
                            <FormSummary.Value>{`${barn.alder} ${plainTekst(aar)}`}</FormSummary.Value>
                        </FormSummary.Answer>
                    )}
                    {!erRegistrertManuelt && (
                        <FormSummary.Answer>
                            <FormSummary.Label>{<TekstBlock block={registrertBostedLabel} />}</FormSummary.Label>
                            <FormSummary.Value>
                                {<TekstBlock block={hentBostedSpråkId(barn, teksterForSteg)} />}
                            </FormSummary.Value>
                        </FormSummary.Answer>
                    )}
                    <FormSummary.Answer>
                        <Checkbox
                            checked={erMedISøknad}
                            aria-label={`${plainTekst(soekOmYtelseForBarnetSjekkboks)} ${barn.navn}`}
                            onChange={() => velgBarnCallback(barn, erMedISøknad)}
                            data-testid={'velg-barn-checkbox'}
                        >
                            <TekstBlock block={soekOmYtelseForBarnetSjekkboks} />
                        </Checkbox>
                    </FormSummary.Answer>
                </FormSummary.Answers>
                {(erRegistrertManuelt || (erMedISøknad && barn.erUnder11Mnd)) && (
                    <FormSummary.Answer>
                        {erRegistrertManuelt && (
                            <Button
                                type={'button'}
                                variant="tertiary"
                                onClick={() => fjernBarnCallback(barn.id)}
                                data-testid={'fjern-barn-knapp'}
                                icon={<TrashFillIcon aria-hidden />}
                            >
                                <TekstBlock block={knappetekst} />
                            </Button>
                        )}

                        {erMedISøknad && barn.erUnder11Mnd && (
                            <InfoCard data-color="warning">
                                <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>
                                    <TekstBlock block={under1Aar} />
                                </InfoCard.Message>
                            </InfoCard>
                        )}
                    </FormSummary.Answer>
                )}
            </FormSummary.Value>
        </FormSummary.Answer>
    );
};

export default Barnekort;
