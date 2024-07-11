import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { Typografi } from '../../../typer/common';
import { IEøsKontantstøttePeriode } from '../../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../../typer/personType';
import { IEøsYtelseTekstinnhold } from '../../../typer/sanity/modaler/eøsYtelse';
import { IEøsForBarnFeltTyper, IOmBarnetFeltTyper } from '../../../typer/skjema';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../PerioderContainer';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';

import { KontantstøttePeriodeModal } from './KontantstøttePeriodeModal';
import { KontantstøttePeriodeOppsummering } from './KontantstøttePeriodeOppsummering';
import { eøsKontantstøtteSpørsmålsdokument } from './kontantstøttePeriodeSpråkUtils';

interface Props {
    skjema: ISkjema<IOmBarnetFeltTyper | IEøsForBarnFeltTyper, string>;
    registrerteEøsKontantstøttePerioder: Felt<IEøsKontantstøttePeriode[]>;
    leggTilKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    fjernKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    barn: IBarnMedISøknad;
    tilhørendeJaNeiSpmFelt: Felt<ESvar | null>;
}

type KontantstøttePeriodeProps = Props & PeriodePersonTypeProps;

export const KontantstøttePeriode: React.FC<KontantstøttePeriodeProps> = ({
    skjema,
    registrerteEøsKontantstøttePerioder,
    leggTilKontantstøttePeriode,
    fjernKontantstøttePeriode,
    personType,
    erDød,
    barn,
    tilhørendeJaNeiSpmFelt,
}) => {
    const { tekster, plainTekst } = useApp();
    const {
        erÅpen: kontantstøtteModalErÅpen,
        lukkModal: lukkKontantstøtteModal,
        åpneModal: åpneKontantstøtteModal,
    } = useModal();

    const teksterForPersonType: IEøsYtelseTekstinnhold =
        tekster().FELLES.modaler.eøsYtelse[personType];

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                spørsmålDokument={eøsKontantstøtteSpørsmålsdokument(personType, tekster(), erDød)}
                inkluderVetIkke={personType !== PersonType.søker}
                flettefelter={{ barnetsNavn: barn?.navn }}
            />
            {tilhørendeJaNeiSpmFelt.verdi === ESvar.JA && (
                <PerioderContainer>
                    {registrerteEøsKontantstøttePerioder.verdi.map((periode, index) => (
                        <KontantstøttePeriodeOppsummering
                            key={`eøs-kontantstøtte-periode-${index}`}
                            kontantstøttePeriode={periode}
                            fjernPeriodeCallback={fjernKontantstøttePeriode}
                            nummer={index + 1}
                            barnetsNavn={barn.navn}
                            personType={personType}
                            erDød={personType === PersonType.andreForelder && erDød}
                        />
                    ))}

                    {registrerteEøsKontantstøttePerioder.verdi.length > 0 && (
                        <TekstBlock
                            block={teksterForPersonType.flerePerioder}
                            typografi={Typografi.Label}
                            flettefelter={{
                                barnetsNavn: barn?.navn,
                            }}
                        />
                    )}

                    <LeggTilKnapp
                        onClick={åpneKontantstøtteModal}
                        id={registrerteEøsKontantstøttePerioder.id}
                        forklaring={plainTekst(teksterForPersonType.leggTilPeriodeForklaring)}
                        feilmelding={
                            registrerteEøsKontantstøttePerioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrerteEøsKontantstøttePerioder.feilmelding
                        }
                    >
                        <TekstBlock block={teksterForPersonType.leggTilKnapp} />
                    </LeggTilKnapp>
                    {kontantstøtteModalErÅpen && (
                        <KontantstøttePeriodeModal
                            erÅpen={kontantstøtteModalErÅpen}
                            lukkModal={lukkKontantstøtteModal}
                            onLeggTilKontantstøttePeriode={leggTilKontantstøttePeriode}
                            barn={barn}
                            personType={personType}
                            erDød={erDød}
                            forklaring={plainTekst(teksterForPersonType.leggTilPeriodeForklaring)}
                        />
                    )}
                </PerioderContainer>
            )}
        </>
    );
};
