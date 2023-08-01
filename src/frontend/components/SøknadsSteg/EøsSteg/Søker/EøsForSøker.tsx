import React from 'react';

import { Heading } from '@navikt/ds-react';

import IdNummerForSøker from './IdNummerForSøker';
import { useEøsForSøker } from './useEøsForSøker';
import { useApp } from '../../../../context/AppContext';
import { PersonType } from '../../../../typer/personType';
import { uppercaseFørsteBokstav } from '../../../../utils/visning';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';

const EøsForSøker: React.FC = () => {
    const { tekster, plainTekst } = useApp();
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilAndreUtbetalingsperiode,
        fjernAndreUtbetalingsperiode,
        settIdNummerFelter,
    } = useEøsForSøker();

    const { eoesForSoekerTittel, hvorBor } = tekster().EØS_FOR_SØKER;

    return (
        <Steg
            tittel={
                <Heading level={'1'} size={'xsmall'}>
                    {uppercaseFørsteBokstav(plainTekst(eoesForSoekerTittel))}
                </Heading>
            }
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <IdNummerForSøker skjema={skjema} settIdNummerFelter={settIdNummerFelter} />
            {skjema.felter.adresseISøkeperiode.erSynlig && (
                <KomponentGruppe>
                    <SkjemaFeltInput
                        felt={skjema.felter.adresseISøkeperiode}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={<TekstBlock block={hvorBor.sporsmal} />}
                        description={plainTekst(hvorBor.beskrivelse)}
                    />
                </KomponentGruppe>
            )}

            <KomponentGruppe>
                <Arbeidsperiode
                    skjema={skjema}
                    arbeiderEllerArbeidetFelt={skjema.felter.arbeidINorge}
                    leggTilArbeidsperiode={leggTilArbeidsperiode}
                    fjernArbeidsperiode={fjernArbeidsperiode}
                    registrerteArbeidsperioder={skjema.felter.registrerteArbeidsperioder}
                    personType={PersonType.søker}
                />
                <Pensjonsperiode
                    skjema={skjema}
                    mottarEllerMottattPensjonFelt={skjema.felter.pensjonNorge}
                    gjelderUtlandet={false}
                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                    fjernPensjonsperiode={fjernPensjonsperiode}
                    registrertePensjonsperioder={skjema.felter.registrertePensjonsperioder}
                    personType={PersonType.søker}
                />
                <Utbetalingsperiode
                    skjema={skjema}
                    leggTilUtbetalingsperiode={leggTilAndreUtbetalingsperiode}
                    fjernUtbetalingsperiode={fjernAndreUtbetalingsperiode}
                    tilhørendeJaNeiSpmFelt={skjema.felter.andreUtbetalinger}
                    registrerteUtbetalingsperioder={skjema.felter.registrerteAndreUtbetalinger}
                    personType={PersonType.søker}
                />
            </KomponentGruppe>
        </Steg>
    );
};

export default EøsForSøker;
