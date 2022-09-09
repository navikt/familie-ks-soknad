import React from 'react';

import { useApp } from '../../../../context/AppContext';
import { PersonType } from '../../../../typer/personType';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';
import IdNummerForSøker from './IdNummerForSøker';
import { EøsSøkerSpørsmålId, eøsSøkerSpørsmålSpråkId } from './spørsmål';
import { useEøsForSøker } from './useEøsForSøker';

const EøsForSøker: React.FC = () => {
    const { tekster } = useApp();
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

    const {
        [ESanitySteg.EØS_FOR_SØKER]: { eoesForSoekerTittel },
    } = tekster();

    return (
        <Steg
            tittel={<TekstBlock block={eoesForSoekerTittel} />}
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
                        labelSpråkTekstId={
                            eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.adresseISøkeperiode]
                        }
                        description={<SpråkTekst id={'felles.hjelpetekst.fulladresse'} />}
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
                    personType={PersonType.Søker}
                />
                <Pensjonsperiode
                    skjema={skjema}
                    mottarEllerMottattPensjonFelt={skjema.felter.pensjonNorge}
                    gjelderUtlandet={false}
                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                    fjernPensjonsperiode={fjernPensjonsperiode}
                    registrertePensjonsperioder={skjema.felter.registrertePensjonsperioder}
                    personType={PersonType.Søker}
                />
                <Utbetalingsperiode
                    skjema={skjema}
                    leggTilUtbetalingsperiode={leggTilAndreUtbetalingsperiode}
                    fjernUtbetalingsperiode={fjernAndreUtbetalingsperiode}
                    tilhørendeJaNeiSpmFelt={skjema.felter.andreUtbetalinger}
                    registrerteUtbetalingsperioder={skjema.felter.registrerteAndreUtbetalinger}
                    personType={PersonType.Søker}
                />
            </KomponentGruppe>
        </Steg>
    );
};

export default EøsForSøker;
