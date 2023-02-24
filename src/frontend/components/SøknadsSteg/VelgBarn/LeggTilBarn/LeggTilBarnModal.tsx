import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { ILeggTilBarnTekstinnhold } from '../../../../typer/sanity/modaler/leggTilBarn';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { visFeiloppsummering } from '../../../../utils/hjelpefunksjoner';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../../../Felleskomponenter/SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
import SkjemaModal from '../../../Felleskomponenter/SkjemaModal/SkjemaModal';
import { SøkerMåBrukePDF } from '../../../Felleskomponenter/SøkerMåBrukePDF';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { useLeggTilBarn } from './useLeggTilBarn';

const LeggTilBarnModal: React.FC<{
    erÅpen: boolean;
    toggleModal: () => void;
}> = ({ erÅpen, toggleModal }) => {
    const { skjema, nullstillSkjema, valideringErOk, leggTilBarn, validerFelterOgVisFeilmelding } =
        useLeggTilBarn();
    const { tekster, plainTekst } = useApp();

    const teksterForLeggTilBarnModal: ILeggTilBarnTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.leggTilBarn;

    const {
        tittel,
        fornavn,
        etternavn,
        foedselsnummerEllerDNummer,
        leggTilKnapp,
        barnetsNavnSubtittel,
        foedselsnummerAlert,
    } = teksterForLeggTilBarnModal;

    const submitOgLukk = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return;
        }
        leggTilBarn();
        toggleModal();
    };

    return (
        <SkjemaModal
            tittel={tittel}
            submitKnappTekst={<TekstBlock block={leggTilKnapp} />}
            erÅpen={erÅpen}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onSubmitCallback={submitOgLukk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe dynamisk>
                <SkjemaFieldset tittel={<TekstBlock block={barnetsNavnSubtittel} />}>
                    <SkjemaFeltInput
                        felt={skjema.felter.fornavn}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={<TekstBlock block={fornavn.sporsmal} />}
                        disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                        htmlSize={40}
                    />

                    <SkjemaFeltInput
                        felt={skjema.felter.etternavn}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={<TekstBlock block={etternavn.sporsmal} />}
                        disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                        htmlSize={40}
                    />

                    <SkjemaCheckbox
                        felt={skjema.felter.navnetErUbestemt}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={plainTekst(etternavn.checkboxLabel)}
                    />
                </SkjemaFieldset>

                <SkjemaFeltInput
                    felt={skjema.felter.ident}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={<TekstBlock block={foedselsnummerEllerDNummer.sporsmal} />}
                    disabled={skjema.felter.ikkeFåttIdentChecked.verdi === ESvar.JA}
                    htmlSize={40}
                />

                <SkjemaCheckbox
                    felt={skjema.felter.ikkeFåttIdentChecked}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={plainTekst(foedselsnummerEllerDNummer.checkboxLabel)}
                />
                {skjema.felter.ikkeFåttIdentChecked.verdi === ESvar.JA && (
                    <SøkerMåBrukePDF advarselTekst={<TekstBlock block={foedselsnummerAlert} />} />
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};

export default LeggTilBarnModal;
