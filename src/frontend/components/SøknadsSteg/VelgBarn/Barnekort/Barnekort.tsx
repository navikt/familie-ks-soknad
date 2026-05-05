import React from 'react';

import { ExclamationmarkTriangleIcon, TrashFillIcon } from '@navikt/aksel-icons';
import { Bleed, Box, Button, Checkbox, Heading, HGrid, HStack, InfoCard, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../../context/AppContext';
import { LocaleRecordBlock } from '../../../../typer/common';
import { IBarn } from '../../../../typer/person';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { formaterFnr, uppercaseFørsteBokstav } from '../../../../utils/visning';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { TilfeldigBarnIkon } from '../../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';
import { IVelgBarnTekstinnhold } from '../innholdTyper';

import styles from './Barnekort.module.css';
import { BarnekortInfo } from './BarnekortInfo';

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
        <Box padding="space-24" background={'sunken'} borderRadius="4">
            <VStack gap="space-24">
                <Bleed marginInline="space-24" marginBlock="space-24 space-0" asChild>
                    <Box
                        borderWidth={'0 0 4 0'}
                        borderRadius={`4 4 0 0`}
                        borderColor={'brand-beige-subtle'}
                        background={'brand-beige-strong'}
                    >
                        <HStack align={'end'} justify={'center'} width={'100%'} height={'var(--a-spacing-32'}>
                            <TilfeldigBarnIkon />
                        </HStack>
                    </Box>
                </Bleed>
                <Heading level="3" size="medium">
                    {barn.adressebeskyttelse ? <TekstBlock block={navnErstatterForAdressesperre} /> : barn.navn}
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: '2fr 1fr 3fr' }}>
                    <BarnekortInfo label={<TekstBlock block={foedselsnummerLabel} />} verdi={fødselsnummerTekst} />
                    {barn.alder && ( // Barn med undefined fødselsdato i pdl eller som søker har lagt inn selv har alder -null-
                        <BarnekortInfo
                            label={<TekstBlock block={alderLabel} />}
                            verdi={`${barn.alder} ${plainTekst(aar)}`}
                        />
                    )}
                    {!erRegistrertManuelt && (
                        <BarnekortInfo
                            label={<TekstBlock block={registrertBostedLabel} />}
                            verdi={<TekstBlock block={hentBostedSpråkId(barn, teksterForSteg)} />}
                        />
                    )}
                </HGrid>
                <hr className={styles.divider} />
                <Checkbox
                    checked={erMedISøknad}
                    aria-label={`${plainTekst(soekOmYtelseForBarnetSjekkboks)} ${barn.navn}`}
                    onChange={() => velgBarnCallback(barn, erMedISøknad)}
                    data-testid={'velg-barn-checkbox'}
                >
                    <TekstBlock block={soekOmYtelseForBarnetSjekkboks} />
                </Checkbox>
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
            </VStack>
        </Box>
    );
};

export default Barnekort;
