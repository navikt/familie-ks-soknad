import React from 'react';

import { SkjemaGruppe } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { ILeggTilBarnTekstinnhold } from '../../../../typer/sanity/modaler/leggTilBarn';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { visFeiloppsummering } from '../../../../utils/hjelpefunksjoner';
import { SkjemaCheckbox } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../../../Felleskomponenter/SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
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
            <SkjemaGruppe legend={<TekstBlock block={barnetsNavnSubtittel} />}>
                <SkjemaFeltInput
                    felt={skjema.felter.fornavn}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={<TekstBlock block={fornavn.sporsmal} />}
                    disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                />

                <SkjemaFeltInput
                    felt={skjema.felter.etternavn}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={<TekstBlock block={etternavn.sporsmal} />}
                    disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                />

                <SkjemaCheckbox
                    felt={skjema.felter.navnetErUbestemt}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={plainTekst(etternavn.checkboxLabel)}
                />
            </SkjemaGruppe>
            <SkjemaFeltInput
                felt={skjema.felter.ident}
                visFeilmeldinger={skjema.visFeilmeldinger}
                label={<TekstBlock block={foedselsnummerEllerDNummer.sporsmal} />}
                disabled={skjema.felter.ikkeFåttIdentChecked.verdi === ESvar.JA}
            />
            <SkjemaCheckbox
                label={plainTekst(foedselsnummerEllerDNummer.checkboxLabel)}
                visFeilmeldinger={skjema.visFeilmeldinger}
                felt={skjema.felter.ikkeFåttIdentChecked}
            />
            {skjema.felter.ikkeFåttIdentChecked.verdi === ESvar.JA && (
                <SøkerMåBrukePDF advarselTekst={<TekstBlock block={foedselsnummerAlert} />} />
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};

export default LeggTilBarnModal;
