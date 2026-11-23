import JaNeiSpm from '@components/Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '@components/Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '@components/Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '@components/Felleskomponenter/PerioderContainer';
import useModal from '@components/Felleskomponenter/SkjemaModal/useModal';
import TekstBlock from '@components/Felleskomponenter/TekstBlock';
import { useAppContext } from '@context/AppContext';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';
import type { IUtbetalingsperiode } from '@typer/perioder';
import { type PeriodePersonTypeMedBarnProps, PersonType } from '@typer/personType';
import type { IEøsForBarnFeltTyper, IEøsForSøkerFeltTyper } from '@typer/skjema';
import { uppercaseFørsteBokstav } from '@utils/visning';
import type { FC } from 'react';

import { mottarEllerMottattUtbetalingApiNavn } from './språkUtils';
import { UtbetalingerModal } from './UtbetalingerModal';
import { UtbetalingsperiodeOppsummering } from './UtbetalingsperiodeOppsummering';

interface UtbetalingsperiodeProps {
    skjema: ISkjema<IEøsForBarnFeltTyper | IEøsForSøkerFeltTyper, string>;
    leggTilUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    fjernUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    gjelderUtlandet?: boolean;
    tilhørendeJaNeiSpmFelt: Felt<ESvar | null>;
    registrerteUtbetalingsperioder: Felt<IUtbetalingsperiode[]>;
}

type Props = UtbetalingsperiodeProps & PeriodePersonTypeMedBarnProps;

export const Utbetalingsperiode: FC<Props> = ({
    skjema,
    leggTilUtbetalingsperiode,
    fjernUtbetalingsperiode,
    tilhørendeJaNeiSpmFelt,
    registrerteUtbetalingsperioder,
    personType,
    erDød,
    barn,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const {
        erÅpen: utbetalingermodalErÅpen,
        lukkModal: lukkUtbetalingsmodal,
        åpneModal: åpneUtbetalingsmodal,
    } = useModal();

    const teksterForPersontype = tekster().FELLES.modaler.andreUtbetalinger[personType];
    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const barnetsNavn = barn && barn.navn;

    return (
        <KomponentGruppe>
            <JaNeiSpm
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                inkluderVetIkke={personType !== PersonType.søker}
                spørsmålDokument={mottarEllerMottattUtbetalingApiNavn(personType, tekster(), erDød)}
                flettefelter={{ barnetsNavn: barnetsNavn }}
            />
            {tilhørendeJaNeiSpmFelt.verdi === ESvar.JA && (
                <PerioderContainer
                    tittel={uppercaseFørsteBokstav(plainTekst(frittståendeOrdTekster.utbetalingsperioder))}
                >
                    {registrerteUtbetalingsperioder.verdi.map((utbetalingsperiode, index) => (
                        <UtbetalingsperiodeOppsummering
                            key={`utbetalingsperiode-${index}`}
                            utbetalingsperiode={utbetalingsperiode}
                            fjernPeriodeCallback={fjernUtbetalingsperiode}
                            nummer={index + 1}
                            personType={personType}
                            erDød={personType === PersonType.andreForelder && erDød}
                            barn={barn}
                        />
                    ))}
                    <LeggTilKnapp
                        onClick={åpneUtbetalingsmodal}
                        id={registrerteUtbetalingsperioder.id}
                        leggTilFlereTekst={
                            registrerteUtbetalingsperioder.verdi.length > 0 &&
                            plainTekst(teksterForPersontype.flerePerioder, {
                                barnetsNavn: barn?.navn,
                            })
                        }
                        feilmelding={
                            registrerteUtbetalingsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrerteUtbetalingsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={teksterForPersontype.leggTilKnapp} />
                    </LeggTilKnapp>
                    {utbetalingermodalErÅpen && (
                        <UtbetalingerModal
                            erÅpen={utbetalingermodalErÅpen}
                            lukkModal={lukkUtbetalingsmodal}
                            onLeggTilUtbetalinger={leggTilUtbetalingsperiode}
                            personType={personType}
                            barn={barn}
                            erDød={erDød}
                            forklaring={plainTekst(teksterForPersontype.leggTilPeriodeForklaring)}
                        />
                    )}
                </PerioderContainer>
            )}
        </KomponentGruppe>
    );
};
