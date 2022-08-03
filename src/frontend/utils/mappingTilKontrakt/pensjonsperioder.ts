import { ESvar } from '@navikt/familie-form-elements';

import {
    pensjonsperiodeModalSpørsmålSpråkId,
    pensjonsperiodeOppsummeringOverskrift,
} from '../../components/Felleskomponenter/Pensjonsmodal/språkUtils';
import { PensjonsperiodeSpørsmålId } from '../../components/Felleskomponenter/Pensjonsmodal/spørsmål';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IPensjonsperiodeIKontraktFormat } from '../../typer/kontrakt/v1';
import { IPensjonsperiode } from '../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../typer/personType';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface PensjonsperiodeIKontraktFormatParams {
    periode: IPensjonsperiode;
    periodeNummer: number;
    gjelderUtlandet: boolean;
}

export const tilIPensjonsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    gjelderUtlandet,
    personType,
    erDød,
    barn,
}: PensjonsperiodeIKontraktFormatParams &
    PeriodePersonTypeMedBarnProps): ISøknadsfelt<IPensjonsperiodeIKontraktFormat> => {
    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = periode;

    const periodenErAvsluttet =
        mottarPensjonNå?.svar === ESvar.NEI || (personType === PersonType.AndreForelder && erDød);

    const hentPensjonsperiodeSpråkId = pensjonsperiodeModalSpørsmålSpråkId(
        personType,
        periodenErAvsluttet
    );

    const hentSpørsmålstekster = (pensjonSpørsmålId: PensjonsperiodeSpørsmålId) =>
        hentTekster(hentPensjonsperiodeSpråkId(pensjonSpørsmålId), {
            ...(barn && { barn: barn.navn }),
        });

    return {
        label: hentTekster(pensjonsperiodeOppsummeringOverskrift(gjelderUtlandet), {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarPensjonNå: mottarPensjonNå.svar
                ? {
                      label: hentSpørsmålstekster(PensjonsperiodeSpørsmålId.mottarPensjonNå),
                      verdi: sammeVerdiAlleSpråk(mottarPensjonNå.svar),
                  }
                : null,
            pensjonsland: pensjonsland.svar
                ? {
                      label: hentSpørsmålstekster(PensjonsperiodeSpørsmålId.pensjonsland),
                      verdi: verdiCallbackAlleSpråk(locale =>
                          landkodeTilSpråk(pensjonsland.svar, locale)
                      ),
                  }
                : null,
            pensjonFra: pensjonFra.svar
                ? {
                      label: hentSpørsmålstekster(PensjonsperiodeSpørsmålId.fraDatoPensjon),
                      verdi: sammeVerdiAlleSpråk(pensjonFra.svar),
                  }
                : null,
            pensjonTil: pensjonTil.svar
                ? {
                      label: hentSpørsmålstekster(PensjonsperiodeSpørsmålId.tilDatoPensjon),
                      verdi: sammeVerdiAlleSpråk(pensjonTil.svar),
                  }
                : null,
        }),
    };
};
