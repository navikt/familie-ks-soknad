import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { formaterDato, formaterDatoMedUkjent } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import TekstBlock from '../TekstBlock';
import { arbeidsperiodeModalSpørsmålSpråkId } from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';

interface Props {
    arbeidsperiode: IArbeidsperiode;
    nummer: number;
    fjernPeriodeCallback?: (arbeidsperiode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
}

type ArbeidperiodeOppsummeringPersonTypeProps =
    | { personType: PersonType.søker; erDød?: boolean }
    | { personType: PersonType.omsorgsperson; erDød?: boolean }
    | { personType: PersonType.andreForelder; erDød: boolean };

type ArbeidsperiodeOppsummeringProps = Props & ArbeidperiodeOppsummeringPersonTypeProps;

export const ArbeidsperiodeOppsummering: React.FC<ArbeidsperiodeOppsummeringProps> = ({
    arbeidsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    gjelderUtlandet,
    personType,
    erDød = false,
}) => {
    const { tekster } = useApp();
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
    const { formatMessage } = intl;
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
    } = arbeidsperiode;

    const teksterForModal: IArbeidsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.arbeidsperiode[personType];

    const periodenErAvsluttet =
        arbeidsperiodeAvsluttet?.svar === ESvar.JA ||
        (personType === PersonType.andreForelder && erDød);

    const hentSpørsmålTekstId = arbeidsperiodeModalSpørsmålSpråkId(personType, periodenErAvsluttet);

    const spørsmålSpråkTekst = (spørsmålId: ArbeidsperiodeSpørsmålsId) => (
        <SpråkTekst id={hentSpørsmålTekstId(spørsmålId)} />
    );

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(arbeidsperiode))
            }
            fjernKnappTekst={teksterForModal.fjernKnapp}
            tittel={
                <TekstBlock
                    block={teksterForModal.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString(), gjelderUtland: gjelderUtlandet }}
                    typografi={Typografi.HeadingH2}
                />
            }
        >
            {arbeidsperiodeAvsluttet.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet)}
                    søknadsvar={arbeidsperiodeAvsluttet.svar}
                />
            )}
            {arbeidsperiodeland.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand)}
                    søknadsvar={landkodeTilSpråk(arbeidsperiodeland.svar, valgtLocale)}
                />
            )}
            {arbeidsgiver.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsgiver)}
                    søknadsvar={arbeidsgiver.svar}
                />
            )}
            {fraDatoArbeidsperiode.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode)}
                    søknadsvar={formaterDato(fraDatoArbeidsperiode.svar)}
                />
            )}
            {tilDatoArbeidsperiode.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode)}
                    søknadsvar={formaterDatoMedUkjent(
                        tilDatoArbeidsperiode.svar,
                        formatMessage({
                            id: hentSpørsmålTekstId(
                                ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                            ),
                        })
                    )}
                />
            )}
        </PeriodeOppsummering>
    );
};
