import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { Arbeidsperiode } from '../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';
import { useDinLivssituasjon } from './useDinLivssituasjon';

const DinLivssituasjon: React.FC = () => {
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
    } = useDinLivssituasjon();

    const {
        [ESanitySteg.DIN_LIVSSITUASJON]: { dinLivssituasjonTittel },
    } = tekster();

    return (
        <Steg
            tittel={<TekstBlock block={dinLivssituasjonTittel.tittel} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erAsylsøker}
                    spørsmålTekstId={
                        dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.erAsylsøker]
                    }
                />
                {skjema.felter.erAsylsøker.verdi === ESvar.JA && (
                    <VedleggNotis dynamisk språkTekstId={'omdeg.asylsøker.alert'} />
                )}

                <Arbeidsperiode
                    skjema={skjema}
                    leggTilArbeidsperiode={leggTilArbeidsperiode}
                    fjernArbeidsperiode={fjernArbeidsperiode}
                    gjelderUtlandet={true}
                    arbeiderEllerArbeidetFelt={skjema.felter.arbeidIUtlandet}
                    registrerteArbeidsperioder={skjema.felter.registrerteArbeidsperioder}
                    personType={PersonType.Søker}
                />

                <Pensjonsperiode
                    skjema={skjema}
                    mottarEllerMottattPensjonFelt={skjema.felter.mottarUtenlandspensjon}
                    registrertePensjonsperioder={skjema.felter.registrertePensjonsperioder}
                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                    fjernPensjonsperiode={fjernPensjonsperiode}
                    gjelderUtlandet={true}
                    personType={PersonType.Søker}
                />
            </KomponentGruppe>
        </Steg>
    );
};

export default DinLivssituasjon;
