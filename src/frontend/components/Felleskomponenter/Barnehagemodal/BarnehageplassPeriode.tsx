import React from 'react';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { Typografi } from '../../../typer/common';
import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import { IOmBarnetTekstinnhold } from '../../SøknadsSteg/OmBarnet/innholdTyper';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../PerioderContainer';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';

import { BarnehageplassPeriodeModal } from './BarnehageplassPeriodeModal';
import { BarnehageplassPeriodeOppsummering } from './BarnehageplassPeriodeOppsummering';

interface BarnehageplassPeriodeProps {
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
    registrerteBarnehageplassPerioder: Felt<IBarnehageplassPeriode[]>;
    leggTilBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    fjernBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    barn: IBarnMedISøknad;
}

export const BarnehageplassPeriode: React.FC<BarnehageplassPeriodeProps> = ({
    skjema,
    registrerteBarnehageplassPerioder,
    leggTilBarnehageplassPeriode,
    fjernBarnehageplassPeriode,
    barn,
}) => {
    const {
        erÅpen: barnehageplassModalErÅpen,
        lukkModal: lukkBarnehageplassModal,
        åpneModal: åpneBarnehageplassModal,
    } = useModal();
    const { tekster, plainTekst } = useApp();
    const { toggles } = useFeatureToggles();
    const barnehageplassTekster: IBarnehageplassTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.barnehageplass;
    const teksterForOmBarnetSteg: IOmBarnetTekstinnhold = tekster()[ESanitySteg.OM_BARNET];
    const barnetsNavn = barn.navn;

    return (
        <PerioderContainer>
            <TekstBlock
                block={teksterForOmBarnetSteg.opplystBarnehageplass}
                flettefelter={{ barnetsNavn }}
                typografi={Typografi.Label}
            />

            {registrerteBarnehageplassPerioder.verdi.map((periode, index) => (
                <BarnehageplassPeriodeOppsummering
                    key={`barnehageplass-periode-${index}`}
                    barnehageplassPeriode={periode}
                    fjernPeriodeCallback={fjernBarnehageplassPeriode}
                    nummer={index + 1}
                />
            ))}

            <LeggTilKnapp
                onClick={åpneBarnehageplassModal}
                id={registrerteBarnehageplassPerioder.id}
                forklaring={
                    registrerteBarnehageplassPerioder.verdi.length > 0 ? (
                        <TekstBlock block={barnehageplassTekster.flerePerioder} />
                    ) : toggles.FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP &&
                      barnehageplassTekster.leggTilPeriodeForklaring ? (
                        plainTekst(barnehageplassTekster.leggTilPeriodeForklaring)
                    ) : undefined
                }
                feilmelding={
                    registrerteBarnehageplassPerioder.erSynlig &&
                    skjema.visFeilmeldinger &&
                    registrerteBarnehageplassPerioder.feilmelding
                }
            >
                <TekstBlock block={barnehageplassTekster.leggTilKnapp} />
            </LeggTilKnapp>
            {barnehageplassModalErÅpen && (
                <BarnehageplassPeriodeModal
                    erÅpen={barnehageplassModalErÅpen}
                    lukkModal={lukkBarnehageplassModal}
                    onLeggTilBarnehageplassPeriode={leggTilBarnehageplassPeriode}
                    barn={barn}
                    forklaring={plainTekst(barnehageplassTekster.leggTilPeriodeForklaring)}
                />
            )}
        </PerioderContainer>
    );
};
