import React from 'react';

import { Alert, Radio, RadioGroup } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import StyledDropdown from '../Dropdowns/StyledDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import TekstBlock from '../TekstBlock';

import { hentBarnehageplassBeskrivelse, hentFraDatoSpørsmål, hentTilDatoSpørsmål } from './barnehageplassSpråkUtils';
import { EBarnehageplassPeriodeBeskrivelse } from './barnehageplassTyper';
import { BarnehageplassPeriodeSpørsmålId } from './spørsmål';
import { useBarnehageplassPeriodeSkjema } from './useBarnehageplassPeriodeSkjema';

export interface IUseBarnehageplassSkjemaParams {
    barn: IBarnMedISøknad;
}

interface Props extends IUseBarnehageplassSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    forklaring?: string;
}

export const BarnehageplassPeriodeModal: React.FC<Props> = ({
    erÅpen,
    lukkModal,
    onLeggTilBarnehageplassPeriode,
    barn,
    forklaring = undefined,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding, slutterIBarnehagenMinDato } =
        useBarnehageplassPeriodeSkjema();
    const { tekster, plainTekst } = useAppContext();
    const barnehageplassTekster: IBarnehageplassTekstinnhold = tekster()[ESanitySteg.FELLES].modaler.barnehageplass;

    const {
        barnehageplassPeriodeBeskrivelse,
        barnehageplassUtlandet,
        barnehageplassLand,
        offentligStøtte,
        harHeltidDeltidBarnehageplass,
        antallTimer,
        startetIBarnehagen,
        slutterIBarnehagen,
        slutterIBarnehagenVetIkke,
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
            harHeltidDeltidBarnehageplass: {
                id: BarnehageplassPeriodeSpørsmålId.harHeltidDeltidBarnehageplass,
                svar: null,
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
                svar: svarForSpørsmålMedUkjent(slutterIBarnehagenVetIkke, slutterIBarnehagen),
            },
        });
        lukkModal();
        nullstillSkjema();
    };
    const barnetsNavn = barn.navn;

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={barnehageplassTekster.tittel}
            forklaring={forklaring}
            flettefelter={{ barnetsNavn }}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={barnehageplassTekster.leggTilKnapp} />}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <div>
                <StyledDropdown<EBarnehageplassPeriodeBeskrivelse | ''>
                    {...barnehageplassPeriodeBeskrivelse.hentNavInputProps(skjema.visFeilmeldinger)}
                    felt={barnehageplassPeriodeBeskrivelse}
                    label={<TekstBlock block={barnehageplassTekster.periodebeskrivelse.sporsmal} />}
                    skjema={skjema}
                    placeholder={plainTekst(barnehageplassTekster.valgalternativPlaceholder)}
                >
                    {Object.keys(EBarnehageplassPeriodeBeskrivelse).map((beskrivelse, number) => (
                        <option key={number} value={beskrivelse}>
                            {plainTekst(
                                hentBarnehageplassBeskrivelse(
                                    beskrivelse as EBarnehageplassPeriodeBeskrivelse,
                                    barnehageplassTekster
                                )
                            )}
                        </option>
                    ))}
                </StyledDropdown>
            </div>
            {barnehageplassUtlandet.erSynlig && (
                <JaNeiSpm
                    skjema={skjema}
                    felt={barnehageplassUtlandet}
                    spørsmålDokument={barnehageplassTekster.utland}
                />
            )}
            {barnehageplassLand.erSynlig && (
                <LandDropdown
                    felt={barnehageplassLand}
                    skjema={skjema}
                    label={<TekstBlock block={barnehageplassTekster.hvilketLand.sporsmal} />}
                    dynamisk
                    ekskluderNorge
                />
            )}
            {offentligStøtte.erSynlig && (
                <JaNeiSpm
                    skjema={skjema}
                    felt={offentligStøtte}
                    spørsmålDokument={barnehageplassTekster.offentligStoette}
                />
            )}
            {harHeltidDeltidBarnehageplass.erSynlig && (
                <RadioGroup
                    {...harHeltidDeltidBarnehageplass.hentNavInputProps(skjema.visFeilmeldinger)}
                    legend={<TekstBlock block={barnehageplassTekster.harHeltidDeltidBarnehageplass.sporsmal} />}
                    name={BarnehageplassPeriodeSpørsmålId.harHeltidDeltidBarnehageplass}
                    error={harHeltidDeltidBarnehageplass.feilmelding}
                >
                    <Radio
                        key={AlternativtSvarForInput.BARNEHAGEPLASS_HELTID}
                        value={AlternativtSvarForInput.BARNEHAGEPLASS_HELTID}
                    >
                        Heltidsplass
                    </Radio>
                    <Radio
                        key={AlternativtSvarForInput.BARNEHAGEPLASS_DELTID}
                        value={AlternativtSvarForInput.BARNEHAGEPLASS_DELTID}
                    >
                        Deltidsplass
                    </Radio>
                </RadioGroup>
            )}
            {antallTimer.erSynlig && (
                <KomponentGruppe>
                    <SkjemaFeltInput
                        felt={antallTimer}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={<TekstBlock block={barnehageplassTekster.antallTimer.sporsmal} />}
                        htmlSize={15}
                    />

                    <Alert variant={'info'} inline>
                        {plainTekst(barnehageplassTekster.antallTimer.alert)}
                    </Alert>
                </KomponentGruppe>
            )}
            {startetIBarnehagen.erSynlig && (
                <Datovelger
                    felt={startetIBarnehagen}
                    skjema={skjema}
                    label={
                        <TekstBlock
                            block={hentFraDatoSpørsmål(barnehageplassPeriodeBeskrivelse.verdi, barnehageplassTekster)}
                        />
                    }
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
                <div>
                    <Datovelger
                        felt={slutterIBarnehagen}
                        skjema={skjema}
                        label={
                            <TekstBlock
                                block={hentTilDatoSpørsmål(
                                    barnehageplassPeriodeBeskrivelse.verdi,
                                    barnehageplassTekster
                                )}
                            />
                        }
                        avgrensMinDato={slutterIBarnehagenMinDato()}
                        avgrensMaxDato={
                            barnehageplassPeriodeBeskrivelse.verdi ===
                            EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE
                                ? dagensDato()
                                : undefined
                        }
                        tilhørendeFraOgMedFelt={startetIBarnehagen}
                        disabled={slutterIBarnehagenVetIkke.verdi === ESvar.JA}
                    />
                    <SkjemaCheckbox
                        felt={slutterIBarnehagenVetIkke}
                        label={plainTekst(barnehageplassTekster.sluttdatoFremtid.checkboxLabel)}
                    />
                </div>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
