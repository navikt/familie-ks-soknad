import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IPensjonsperiodeIKontraktFormat } from '../../typer/kontrakt/søknadKontrakt';
import { IPensjonsperiode } from '../../typer/perioder';
import { IPensjonsperiodeTekstinnhold } from '../../typer/sanity/modaler/pensjonsperiode';
import { formaterDatostringKunMåned } from '../dato';
import { landkodeTilSpråk } from '../språk';
import { uppercaseFørsteBokstav } from '../visning';

import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface PensjonsperiodeIKontraktFormatParams {
    periode: IPensjonsperiode;
    periodeNummer: number;
    gjelderUtlandet: boolean;
    tilRestLocaleRecord: TilRestLocaleRecord;
    tekster: IPensjonsperiodeTekstinnhold;
    barn?: IBarnMedISøknad;
    toggleSpørOmMånedIkkeDato: boolean;
}

export const tilIPensjonsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    gjelderUtlandet,
    tilRestLocaleRecord,
    tekster,
    barn,
    toggleSpørOmMånedIkkeDato,
}: PensjonsperiodeIKontraktFormatParams): ISøknadsfelt<IPensjonsperiodeIKontraktFormat> => {
    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = periode;

    const periodenErAvsluttet = mottarPensjonNå?.svar !== ESvar.JA;

    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel, {
            antall: periodeNummer.toString(),
            gjelderUtland: gjelderUtlandet,
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarPensjonNå: mottarPensjonNå.svar
                ? {
                      label: tilRestLocaleRecord(tekster.faarPensjonNaa.sporsmal, {
                          barnetsNavn: barn?.navn,
                      }),
                      verdi: sammeVerdiAlleSpråk(mottarPensjonNå.svar),
                  }
                : null,
            pensjonsland: pensjonsland.svar
                ? {
                      label: tilRestLocaleRecord(
                          periodenErAvsluttet
                              ? tekster.pensjonLandFortid.sporsmal
                              : tekster.pensjonLandNaatid.sporsmal,
                          {
                              barnetsNavn: barn?.navn,
                          }
                      ),
                      verdi: verdiCallbackAlleSpråk(locale =>
                          landkodeTilSpråk(pensjonsland.svar, locale)
                      ),
                  }
                : null,
            pensjonFra: pensjonFra.svar
                ? {
                      label: tilRestLocaleRecord(tekster.startdato.sporsmal),
                      verdi: toggleSpørOmMånedIkkeDato
                          ? verdiCallbackAlleSpråk(locale =>
                                uppercaseFørsteBokstav(
                                    formaterDatostringKunMåned(pensjonFra.svar, locale)
                                )
                            )
                          : sammeVerdiAlleSpråk(pensjonFra.svar),
                  }
                : null,
            pensjonTil: pensjonTil.svar
                ? {
                      label: tilRestLocaleRecord(tekster.sluttdato.sporsmal),
                      verdi: toggleSpørOmMånedIkkeDato
                          ? verdiCallbackAlleSpråk(locale =>
                                uppercaseFørsteBokstav(
                                    formaterDatostringKunMåned(pensjonTil.svar, locale)
                                )
                            )
                          : sammeVerdiAlleSpråk(pensjonTil.svar),
                  }
                : null,
        }),
    };
};
