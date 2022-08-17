import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { dagenEtterDato, dagensDato, gårsdagensDato, morgendagensDato } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import AlertStripe from '../AlertStripe/AlertStripe';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import StyledDropdown from '../Dropdowns/StyledDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { beskrivelseSpråkId } from './barnehageplassSpråkUtils';
import { EBarnehageplassPeriodeBeskrivelse } from './barnehageplassTyper';
import { BarnehageplassPeriodeSpørsmålId } from './spørsmål';
import { useBarnehageplassPeriodeSkjema } from './useBarnehageplassPeriodeSkjema';

export interface IUseBarnehageplassSkjemaParams {
    personType: PersonType;
    barn: IBarnMedISøknad;
}

interface Props extends ReturnType<typeof useModal>, IUseBarnehageplassSkjemaParams {
    onLeggTilBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
}
const StyledAlertStripe = styled(AlertStripe)`
    margin: 1rem 0 1rem 0;
`;

export const BarnehageplassPeriodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilBarnehageplassPeriode,
    barn,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useBarnehageplassPeriodeSkjema(barn);

    const {
        barnehageplassPeriodeBeskrivelse,
        barnehageplassUtlandet,
        barnehageplassLand,
        offentligStøtte,
        antallTimer,
        startetIBarnehagen,
        slutterIBarnehagen,
    } = skjema.felter;
    const { formatMessage } = useIntl();

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
    const spørsmålSpråkTekst = (spørsmålId: BarnehageplassPeriodeSpørsmålId) => (
        <SpråkTekst id={spørsmålId} values={{ barn: barn.navn }} />
    );

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={'todo.ombarnet.barnehageplass.periode'}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'todo.ombarnet.barnehageplass.periode'}
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
                            <SpråkTekst
                                id={'todo.ombarnet.barnehageplass.periode'}
                                values={{ ...(barn && { barn: barn.navn }) }}
                            />
                        }
                        skjema={skjema}
                        placeholder={formatMessage({ id: 'todo.ombarnet.barnehageplass.periode' })}
                        bredde={'fullbredde'}
                    >
                        {Object.keys(EBarnehageplassPeriodeBeskrivelse).map(
                            (beskrivelse, number) => (
                                <option key={number} value={beskrivelse}>
                                    {formatMessage(
                                        {
                                            id: beskrivelseSpråkId(
                                                beskrivelse as EBarnehageplassPeriodeBeskrivelse
                                            ),
                                        },
                                        { ...(barn && { barn: barn.navn }) }
                                    )}
                                </option>
                            )
                        )}
                    </StyledDropdown>
                </div>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.barnehageplassUtlandet}
                    spørsmålTekstId={'todo.ombarnet.barnehageplass.periode'}
                    språkValues={{ barn: barn.navn }}
                />
                {barnehageplassLand.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.barnehageplassLand}
                        skjema={skjema}
                        label={spørsmålSpråkTekst(
                            BarnehageplassPeriodeSpørsmålId.barnehageplassLand
                        )}
                        dynamisk
                        ekskluderNorge
                    />
                )}
                {offentligStøtte.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.offentligStøtte}
                        spørsmålTekstId={'todo.ombarnet.barnehageplass.periode'}
                    />
                )}
                <SkjemaFeltInput
                    felt={skjema.felter.antallTimer}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={'todo.ombarnet.barnehageplass.periode'}
                    språkValues={{
                        ...(barn && {
                            barn: barn.navn,
                        }),
                    }}
                    tilleggsinfo={
                        <StyledAlertStripe>
                            <SpråkTekst id={'todo.ombarnet.barnehageplass.periode'} />
                        </StyledAlertStripe>
                    }
                    bredde={'S'}
                />
                {/*TODO legge inn riktige begrensninger*/}
                <Datovelger
                    felt={skjema.felter.startetIBarnehagen}
                    skjema={skjema}
                    label={spørsmålSpråkTekst(BarnehageplassPeriodeSpørsmålId.startetIBarnehagen)}
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
                <Datovelger
                    felt={skjema.felter.slutterIBarnehagen}
                    skjema={skjema}
                    label={spørsmålSpråkTekst(BarnehageplassPeriodeSpørsmålId.slutterIBarnehagen)}
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
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
