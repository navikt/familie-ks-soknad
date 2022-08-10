import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { PersonType } from '../../../typer/personType';
import { Arbeidsperiode } from '../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';
import { useDinLivssituasjon } from './useDinLivssituasjon';

const DinLivssituasjon: React.FC = () => {
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

    return (
        <Steg
            tittel={<SpråkTekst id={'dinlivssituasjon.sidetittel'} />}
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
