import React from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { Typografi } from '../../../typer/common';
import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { dagenEtterDato, dagensDato, gårsdagensDato, morgendagensDato } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import StyledDropdown from '../Dropdowns/StyledDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';
import {
    hentBarnehageplassBeskrivelse,
    hentFraDatoSpørsmål,
    hentTilDatoSpørsmål,
} from './barnehageplassSpråkUtils';
import { EBarnehageplassPeriodeBeskrivelse } from './barnehageplassTyper';
import { BarnehageplassPeriodeSpørsmålId } from './spørsmål';
import { useBarnehageplassPeriodeSkjema } from './useBarnehageplassPeriodeSkjema';

const StyledAlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

export interface IUseBarnehageplassSkjemaParams {
    barn: IBarnMedISøknad;
}

interface Props extends ReturnType<typeof useModal>, IUseBarnehageplassSkjemaParams {
    onLeggTilBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
}

export const BarnehageplassPeriodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilBarnehageplassPeriode,
    barn,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useBarnehageplassPeriodeSkjema();
    const { tekster, plainTekst } = useApp();
    const barnehageplassTekster: IBarnehageplassTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.barnehageplass;

    const {
        barnehageplassPeriodeBeskrivelse,
        barnehageplassUtlandet,
        barnehageplassLand,
        offentligStøtte,
        antallTimer,
        startetIBarnehagen,
        slutterIBarnehagen,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilBarnehageplassPeriode({
            barnehageplassPeriodeBeskrivelse: {
                id: BarnehageplassPeriodeSpørsmålId.barnehageplassPeriodeBeskrivelse,
                svar: barnehageplassPeriodeBeskrivelse.verdi as EBarnehageplassPeriodeBeskrivelse,
            },
            barnehageplassUtlandet: {
                id: BarnehageplassPeriodeSpørsmålId.barnehageplassUtlandet,
                svar: barnehageplassUtlandet.verdi as ESvar,
            },
            barnehageplassLand: {
                id: BarnehageplassPeriodeSpørsmålId.barnehageplassLand,
                svar: barnehageplassLand.erSynlig ? barnehageplassLand.verdi : '',
            },
            offentligStøtte: {
                id: BarnehageplassPeriodeSpørsmålId.offentligStøtte,
                svar: offentligStøtte.erSynlig ? offentligStøtte.verdi : null,
            },
            antallTimer: {
                id: BarnehageplassPeriodeSpørsmålId.antallTimer,
                svar: trimWhiteSpace(antallTimer.verdi),
            },
            startetIBarnehagen: {
                id: BarnehageplassPeriodeSpørsmålId.startetIBarnehagen,
                svar: startetIBarnehagen.verdi,
            },
            slutterIBarnehagen: {
                id: BarnehageplassPeriodeSpørsmålId.slutterIBarnehagen,
                svar: slutterIBarnehagen.verdi,
            },
        });
        toggleModal();
        nullstillSkjema();
    };
    const barnetsNavn = barn.navn;

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={
                <TekstBlock
                    block={barnehageplassTekster.tittel}
                    flettefelter={{ barnetsNavn }}
                    typografi={Typografi.ModalHeadingH1}
                />
            }
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={barnehageplassTekster.leggTilKnapp} />}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                <div>
                    <StyledDropdown<EBarnehageplassPeriodeBeskrivelse | ''>
                        {...skjema.felter.barnehageplassPeriodeBeskrivelse.hentNavInputProps(
                            skjema.visFeilmeldinger
                        )}
                        felt={skjema.felter.barnehageplassPeriodeBeskrivelse}
                        label={
                            <TekstBlock block={barnehageplassTekster.periodebeskrivelse.sporsmal} />
                        }
                        skjema={skjema}
                        placeholder={plainTekst(barnehageplassTekster.valgalternativPlaceholder)}
                        bredde={'fullbredde'}
                    >
                        {Object.keys(EBarnehageplassPeriodeBeskrivelse).map(
                            (beskrivelse, number) => (
                                <option key={number} value={beskrivelse}>
                                    {plainTekst(
                                        hentBarnehageplassBeskrivelse(
                                            beskrivelse as EBarnehageplassPeriodeBeskrivelse,
                                            barnehageplassTekster
                                        )
                                    )}
                                </option>
                            )
                        )}
                    </StyledDropdown>
                </div>

                {barnehageplassUtlandet.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.barnehageplassUtlandet}
                        spørsmålDokument={barnehageplassTekster.utland}
                    />
                )}
                {barnehageplassLand.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.barnehageplassLand}
                        skjema={skjema}
                        label={<TekstBlock block={barnehageplassTekster.hvilketLand.sporsmal} />}
                        dynamisk
                        ekskluderNorge
                    />
                )}
                {offentligStøtte.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.offentligStøtte}
                        spørsmålDokument={barnehageplassTekster.offentligStoette}
                    />
                )}
                {antallTimer.erSynlig && (
                    <>
                        <SkjemaFeltInput
                            felt={skjema.felter.antallTimer}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            label={
                                <TekstBlock block={barnehageplassTekster.antallTimer.sporsmal} />
                            }
                            bredde={'S'}
                        />

                        <StyledAlertStripe variant={'info'} inline>
                            {plainTekst(barnehageplassTekster.antallTimer.alert)}
                        </StyledAlertStripe>
                    </>
                )}
                {startetIBarnehagen.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.startetIBarnehagen}
                        skjema={skjema}
                        label={
                            <TekstBlock
                                block={hentFraDatoSpørsmål(
                                    skjema.felter.barnehageplassPeriodeBeskrivelse.verdi,
                                    barnehageplassTekster
                                )}
                            />
                        }
                        calendarPosition={'fullscreen'}
                        avgrensMinDato={
                            barnehageplassPeriodeBeskrivelse.verdi ===
                            EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN
                                ? dagensDato()
                                : undefined
                        }
                        avgrensMaxDato={
                            barnehageplassPeriodeBeskrivelse.verdi ===
                            EBarnehageplassPeriodeBeskrivelse.HAR_BARNEHAGEPLASS_NÅ
                                ? dagensDato()
                                : barnehageplassPeriodeBeskrivelse.verdi ===
                                  EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE
                                ? gårsdagensDato()
                                : undefined
                        }
                    />
                )}
                {slutterIBarnehagen.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.slutterIBarnehagen}
                        skjema={skjema}
                        label={
                            <TekstBlock
                                block={hentTilDatoSpørsmål(
                                    skjema.felter.barnehageplassPeriodeBeskrivelse.verdi,
                                    barnehageplassTekster
                                )}
                            />
                        }
                        calendarPosition={'fullscreen'}
                        avgrensMinDato={
                            barnehageplassPeriodeBeskrivelse.verdi ===
                            EBarnehageplassPeriodeBeskrivelse.HAR_BARNEHAGEPLASS_NÅ
                                ? morgendagensDato()
                                : dagenEtterDato(startetIBarnehagen.verdi)
                        }
                        avgrensMaxDato={
                            barnehageplassPeriodeBeskrivelse.verdi ===
                            EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE
                                ? dagensDato()
                                : undefined
                        }
                        tilhørendeFraOgMedFelt={skjema.felter.startetIBarnehagen}
                    />
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
