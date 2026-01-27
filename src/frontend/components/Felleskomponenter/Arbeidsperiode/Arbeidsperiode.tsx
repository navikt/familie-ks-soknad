import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import {
    IDinLivssituasjonFeltTyper,
    IEøsForBarnFeltTyper,
    IEøsForSøkerFeltTyper,
    IOmBarnetFeltTyper,
} from '../../../typer/skjema';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../PerioderContainer';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';

import { ArbeidsperiodeModal } from './ArbeidsperiodeModal';
import { ArbeidsperiodeOppsummering } from './ArbeidsperiodeOppsummering';
import { arbeidsperiodeSpørsmålDokument } from './arbeidsperiodeSpråkUtils';

interface ArbeidsperiodeProps {
    skjema: ISkjema<
        IDinLivssituasjonFeltTyper | IOmBarnetFeltTyper | IEøsForSøkerFeltTyper | IEøsForBarnFeltTyper,
        string
    >;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet?: boolean;
    arbeiderEllerArbeidetFelt: Felt<ESvar | null>;
    registrerteArbeidsperioder: Felt<IArbeidsperiode[]>;
}

type Props = ArbeidsperiodeProps & PeriodePersonTypeMedBarnProps;

export const Arbeidsperiode: React.FC<Props> = ({
    skjema,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    gjelderUtlandet = false,
    arbeiderEllerArbeidetFelt,
    registrerteArbeidsperioder,
    personType,
    erDød,
    barn,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const { erÅpen: arbeidsmodalErÅpen, lukkModal: lukkArbeidsmodal, åpneModal: åpneArbeidsmodal } = useModal();
    const teksterForModal: IArbeidsperiodeTekstinnhold = tekster().FELLES.modaler.arbeidsperiode[personType];
    const { flerePerioder, leggTilKnapp, leggTilPeriodeForklaring } = teksterForModal;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;
    const { arbeidsperioder, utenfor, i, norge } = frittståendeOrdTekster;

    const perioderContainerTittel = uppercaseFørsteBokstav(
        `${plainTekst(arbeidsperioder)} ${plainTekst(gjelderUtlandet ? utenfor : i)} ${plainTekst(norge)}`
    );

    return (
        <KomponentGruppe>
            <JaNeiSpm
                skjema={skjema}
                felt={arbeiderEllerArbeidetFelt}
                spørsmålDokument={arbeidsperiodeSpørsmålDokument(gjelderUtlandet, personType, tekster, erDød)}
                inkluderVetIkke={personType !== PersonType.søker}
                flettefelter={{ barnetsNavn: barn?.navn }}
            />
            {arbeiderEllerArbeidetFelt.verdi === ESvar.JA && (
                <PerioderContainer tittel={perioderContainerTittel}>
                    {registrerteArbeidsperioder.verdi.map((periode, index) => (
                        <ArbeidsperiodeOppsummering
                            key={`arbeidsperiode-${index}`}
                            arbeidsperiode={periode}
                            fjernPeriodeCallback={fjernArbeidsperiode}
                            nummer={index + 1}
                            gjelderUtlandet={gjelderUtlandet}
                            personType={personType}
                            erDød={personType === PersonType.andreForelder && erDød}
                            barn={personType !== PersonType.søker ? barn : undefined}
                        />
                    ))}
                    <LeggTilKnapp
                        onClick={åpneArbeidsmodal}
                        id={registrerteArbeidsperioder.id}
                        leggTilFlereTekst={
                            registrerteArbeidsperioder.verdi.length > 0 &&
                            plainTekst(flerePerioder, {
                                gjelderUtland: gjelderUtlandet,
                                barnetsNavn: barn?.navn,
                            })
                        }
                        feilmelding={
                            registrerteArbeidsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrerteArbeidsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={leggTilKnapp} />
                    </LeggTilKnapp>
                    {arbeidsmodalErÅpen && (
                        <ArbeidsperiodeModal
                            erÅpen={arbeidsmodalErÅpen}
                            lukkModal={lukkArbeidsmodal}
                            onLeggTilArbeidsperiode={leggTilArbeidsperiode}
                            gjelderUtlandet={gjelderUtlandet}
                            personType={personType}
                            erDød={erDød}
                            barn={barn}
                            forklaring={plainTekst(leggTilPeriodeForklaring, { gjelderUtland: gjelderUtlandet })}
                        />
                    )}
                </PerioderContainer>
            )}
        </KomponentGruppe>
    );
};
