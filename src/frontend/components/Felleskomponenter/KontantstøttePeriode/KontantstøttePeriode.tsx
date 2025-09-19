import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IEøsKontantstøttePeriode } from '../../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../../typer/personType';
import { IEøsYtelseTekstinnhold } from '../../../typer/sanity/modaler/eøsYtelse';
import { IEøsForBarnFeltTyper, IOmBarnetFeltTyper } from '../../../typer/skjema';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
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
    const { tekster, plainTekst } = useAppContext();
    const {
        erÅpen: kontantstøtteModalErÅpen,
        lukkModal: lukkKontantstøtteModal,
        åpneModal: åpneKontantstøtteModal,
    } = useModal();

    const teksterForPersonType: IEøsYtelseTekstinnhold = tekster().FELLES.modaler.eøsYtelse[personType];

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <KomponentGruppe>
            <JaNeiSpm
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                spørsmålDokument={eøsKontantstøtteSpørsmålsdokument(personType, tekster(), erDød)}
                inkluderVetIkke={personType !== PersonType.søker}
                flettefelter={{ barnetsNavn: barn?.navn }}
            />
            {tilhørendeJaNeiSpmFelt.verdi === ESvar.JA && (
                <PerioderContainer
                    tittel={uppercaseFørsteBokstav(plainTekst(frittståendeOrdTekster.kontantstoetteperioder))}
                >
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
                    <LeggTilKnapp
                        onClick={åpneKontantstøtteModal}
                        id={registrerteEøsKontantstøttePerioder.id}
                        leggTilFlereTekst={
                            registrerteEøsKontantstøttePerioder.verdi.length > 0 &&
                            plainTekst(teksterForPersonType.flerePerioder, {
                                barnetsNavn: barn?.navn,
                            })
                        }
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
        </KomponentGruppe>
    );
};
