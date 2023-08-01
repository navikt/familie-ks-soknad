import React from 'react';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { AlternativtSvarForInput, Typografi } from '../../../typer/common';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps } from '../../../typer/personType';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { formaterDato, formaterDatoMedUkjent } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../TekstBlock';

import {
    hentFraDatoSpørsmål,
    hentLandSpørsmål,
    hentTilDatoSpørsmål,
    hentUtenlandsoppholdÅrsak,
} from './utenlandsoppholdSpråkUtils';

type Props = {
    periode: IUtenlandsperiode;
    nummer: number;
    fjernPeriodeCallback?: (periode: IUtenlandsperiode) => void;
};

type UtenlandsperiodeOppsummeringProps = Props & PeriodePersonTypeMedBarnProps;

export const UtenlandsperiodeOppsummering: React.FC<UtenlandsperiodeOppsummeringProps> = ({
    periode,
    nummer,
    fjernPeriodeCallback,
    personType,
    barn,
}) => {
    const [valgtLocale] = useSprakContext();
    const { plainTekst, tekster } = useApp();
    const {
        oppholdsland,
        utenlandsoppholdÅrsak,
        oppholdslandFraDato,
        oppholdslandTilDato,
        adresse,
    } = periode;
    const årsak = utenlandsoppholdÅrsak.svar;
    const teksterForPersonType: IUtenlandsoppholdTekstinnhold =
        tekster().FELLES.modaler.utenlandsopphold[personType];

    const adresseTekst: ISanitySpørsmålDokument | undefined =
        årsak === EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE ||
        årsak === EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE
            ? teksterForPersonType.adresseFortid
            : teksterForPersonType.adresseNaatid;

    return (
        <>
            <PeriodeOppsummering
                fjernKnappTekst={teksterForPersonType.fjernKnapp}
                tittel={
                    <TekstBlock
                        block={teksterForPersonType.oppsummeringstittel}
                        flettefelter={{ antall: nummer.toString() }}
                        typografi={Typografi.Label}
                    />
                }
                fjernPeriodeCallback={fjernPeriodeCallback && (() => fjernPeriodeCallback(periode))}
            >
                <OppsummeringFelt
                    spørsmålstekst={teksterForPersonType.periodeBeskrivelse.sporsmal}
                    søknadsvar={plainTekst(hentUtenlandsoppholdÅrsak(årsak, teksterForPersonType))}
                />

                <OppsummeringFelt
                    spørsmålstekst={hentLandSpørsmål(årsak, teksterForPersonType)}
                    søknadsvar={landkodeTilSpråk(oppholdsland.svar, valgtLocale)}
                    flettefelter={{ barnetsNavn: barn?.navn }}
                />

                {oppholdslandFraDato.svar && (
                    <OppsummeringFelt
                        spørsmålstekst={hentFraDatoSpørsmål(årsak, teksterForPersonType)}
                        søknadsvar={formaterDato(oppholdslandFraDato.svar)}
                    />
                )}

                {oppholdslandTilDato.svar && (
                    <OppsummeringFelt
                        spørsmålstekst={hentTilDatoSpørsmål(årsak, teksterForPersonType)}
                        søknadsvar={formaterDatoMedUkjent(
                            oppholdslandTilDato.svar,
                            plainTekst(teksterForPersonType.sluttdatoFremtid.checkboxLabel)
                        )}
                    />
                )}

                {adresse.svar && (
                    <OppsummeringFelt
                        spørsmålstekst={adresseTekst?.sporsmal}
                        søknadsvar={
                            adresse.svar === AlternativtSvarForInput.UKJENT
                                ? plainTekst(adresseTekst?.checkboxLabel)
                                : adresse.svar
                        }
                    />
                )}
            </PeriodeOppsummering>
        </>
    );
};
