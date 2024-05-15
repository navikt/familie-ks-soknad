import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { AlternativtSvarForInput, Typografi } from '../../../typer/common';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { formaterDato, formaterDatoMedUkjent } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import { useSpråk } from '../Dekoratøren/SpråkContext';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../TekstBlock';

interface Props {
    arbeidsperiode: IArbeidsperiode;
    nummer: number;
    fjernPeriodeCallback?: (arbeidsperiode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
}

type ArbeidsperiodeOppsummeringProps = Props & PeriodePersonTypeMedBarnProps;

export const ArbeidsperiodeOppsummering: React.FC<ArbeidsperiodeOppsummeringProps> = ({
    arbeidsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    gjelderUtlandet,
    personType,
    erDød = false,
    barn,
}) => {
    const { tekster, plainTekst } = useApp();
    const { valgtLocale } = useSpråk();
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
        adresse,
    } = arbeidsperiode;

    const teksterForModal: IArbeidsperiodeTekstinnhold =
        tekster().FELLES.modaler.arbeidsperiode[personType];

    const periodenErAvsluttet =
        arbeidsperiodeAvsluttet?.svar === ESvar.JA ||
        (personType === PersonType.andreForelder && erDød);

    const adresseTekst = periodenErAvsluttet
        ? teksterForModal.adresseFortid
        : teksterForModal.adresseNaatid;

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
                    spørsmålstekst={teksterForModal.arbeidsperiodenAvsluttet.sporsmal}
                    søknadsvar={arbeidsperiodeAvsluttet.svar}
                />
            )}
            {arbeidsperiodeland.svar && (
                <OppsummeringFelt
                    spørsmålstekst={
                        periodenErAvsluttet
                            ? teksterForModal.hvilketLandFortid.sporsmal
                            : teksterForModal.hvilketLandNaatid.sporsmal
                    }
                    flettefelter={{ barnetsNavn: barn?.navn }}
                    søknadsvar={landkodeTilSpråk(arbeidsperiodeland.svar, valgtLocale)}
                />
            )}
            <OppsummeringFelt
                spørsmålstekst={teksterForModal.arbeidsgiver.sporsmal}
                søknadsvar={arbeidsgiver.svar}
            />
            <OppsummeringFelt
                spørsmålstekst={teksterForModal.startdato.sporsmal}
                søknadsvar={formaterDato(fraDatoArbeidsperiode.svar)}
            />
            <OppsummeringFelt
                spørsmålstekst={
                    periodenErAvsluttet
                        ? teksterForModal.sluttdatoFortid.sporsmal
                        : teksterForModal.sluttdatoFremtid.sporsmal
                }
                søknadsvar={formaterDatoMedUkjent(
                    tilDatoArbeidsperiode.svar,
                    plainTekst(teksterForModal.sluttdatoFremtid.checkboxLabel)
                )}
            />
            {adresse.svar && (
                <OppsummeringFelt
                    spørsmålstekst={adresseTekst.sporsmal}
                    søknadsvar={
                        adresse.svar === AlternativtSvarForInput.UKJENT
                            ? plainTekst(adresseTekst.checkboxLabel)
                            : adresse.svar
                    }
                />
            )}
        </PeriodeOppsummering>
    );
};
