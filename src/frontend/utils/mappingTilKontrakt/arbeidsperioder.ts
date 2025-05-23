import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../../typer/barn';
import { AlternativtSvarForInput, ISODateString } from '../../typer/common';
import { ISøknadsfelt, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IArbeidsperiodeIKontraktFormat } from '../../typer/kontrakt/søknadKontrakt';
import { IArbeidsperiode } from '../../typer/perioder';
import { IArbeidsperiodeTekstinnhold } from '../../typer/sanity/modaler/arbeidsperiode';
import { ISøknadSpørsmål } from '../../typer/spørsmål';
import { formaterDatostringKunMåned } from '../dato';
import { landkodeTilSpråk } from '../språk';
import { uppercaseFørsteBokstav } from '../visning';

import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    søknadsfeltHof,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

interface ArbeidsperiodeIKontraktFormatParams {
    periode: IArbeidsperiode;
    periodeNummer: number;
    gjelderUtlandet: boolean;
    tilRestLocaleRecord: TilRestLocaleRecord;
    tekster: IArbeidsperiodeTekstinnhold;
    barn?: IBarnMedISøknad;
}

export const tilIArbeidsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    gjelderUtlandet,
    tilRestLocaleRecord,
    tekster,
    barn,
}: ArbeidsperiodeIKontraktFormatParams): ISøknadsfelt<IArbeidsperiodeIKontraktFormat> => {
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
        adresse,
    } = periode;

    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);

    const periodenErAvsluttet: boolean = arbeidsperiodeAvsluttet?.svar !== ESvar.NEI;

    const adresseTekst = periodenErAvsluttet ? tekster.adresseFortid : tekster.adresseNaatid;
    const sluttdatoTekst = periodenErAvsluttet ? tekster.sluttdatoFortid : tekster.sluttdatoFremtid;
    const landTekst = periodenErAvsluttet ? tekster.hvilketLandFortid : tekster.hvilketLandNaatid;

    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel, {
            antall: periodeNummer.toString(),
            gjelderUtland: gjelderUtlandet,
        }),
        verdi: sammeVerdiAlleSpråk({
            arbeidsperiodeAvsluttet: arbeidsperiodeAvsluttet.svar
                ? {
                      label: tilRestLocaleRecord(tekster.arbeidsperiodenAvsluttet.sporsmal),
                      verdi: sammeVerdiAlleSpråk(arbeidsperiodeAvsluttet.svar),
                  }
                : null,
            arbeidsperiodeland: arbeidsperiodeland.svar
                ? {
                      label: tilRestLocaleRecord(landTekst.sporsmal, { barnetsNavn: barn?.navn }),
                      verdi: verdiCallbackAlleSpråk(locale =>
                          landkodeTilSpråk(arbeidsperiodeland.svar, locale)
                      ),
                  }
                : null,
            arbeidsgiver: {
                label: tilRestLocaleRecord(tekster.arbeidsgiver.sporsmal),
                verdi: sammeVerdiAlleSpråk(arbeidsgiver.svar),
            },
            fraDatoArbeidsperiode: {
                label: tilRestLocaleRecord(tekster.startdato.sporsmal),
                verdi: datoTilVerdiForKontrakt(fraDatoArbeidsperiode),
            },
            tilDatoArbeidsperiode: {
                label: tilRestLocaleRecord(sluttdatoTekst.sporsmal),
                verdi:
                    tilDatoArbeidsperiode.svar === AlternativtSvarForInput.UKJENT &&
                    tekster.sluttdatoFremtid.checkboxLabel
                        ? tilRestLocaleRecord(tekster.sluttdatoFremtid.checkboxLabel)
                        : datoTilVerdiForKontrakt(tilDatoArbeidsperiode),
            },
            adresse: adresse.svar
                ? søknadsfelt(
                      adresseTekst.sporsmal,
                      sammeVerdiAlleSpråkEllerUkjent(
                          tilRestLocaleRecord,
                          adresse.svar,
                          adresseTekst.checkboxLabel
                      )
                  )
                : null,
        }),
    };
};

function datoTilVerdiForKontrakt(skjemaSpørsmål: ISøknadSpørsmål<ISODateString | ''>) {
    return verdiCallbackAlleSpråk(locale =>
        uppercaseFørsteBokstav(formaterDatostringKunMåned(skjemaSpørsmål.svar, locale))
    );
}
