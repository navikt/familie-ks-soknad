import { ESvar } from '@navikt/familie-form-elements';

import { kontantstøttePeriodeModalSpørsmålSpråkId } from '../../components/Felleskomponenter/KontantstøttePeriode/kontantstøttePeriodeSpråkUtils';
import { KontantstøttePeriodeSpørsmålId } from '../../components/Felleskomponenter/KontantstøttePeriode/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IEøsKontantstøttePeriodeIKontraktFormat } from '../../typer/kontrakt/v1';
import { IEøsKontantstøttePeriode } from '../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../typer/personType';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface PensjonperiodeIKontraktFormatParams {
    periode: IEøsKontantstøttePeriode;
    periodeNummer: number;
    barn: IBarnMedISøknad;
}

export const tilIEøsKontantstøttePeriodeIKontraktFormat = ({
    periode,
    periodeNummer,
    barn,
    personType,
    erDød,
}: PensjonperiodeIKontraktFormatParams &
    PeriodePersonTypeProps): ISøknadsfelt<IEøsKontantstøttePeriodeIKontraktFormat> => {
    const {
        mottarEøsKontantstøtteNå,
        kontantstøtteLand,
        fraDatoKontantstøttePeriode,
        tilDatoKontantstøttePeriode,
        månedligBeløp,
    } = periode;
    const periodenErAvsluttet =
        mottarEøsKontantstøtteNå.svar === ESvar.NEI ||
        (personType === PersonType.andreForelder && erDød);

    const hentSpørsmålTekstId = (spørsmålId: KontantstøttePeriodeSpørsmålId) => {
        const kontantstøttePeriodeSpørsmålSpråkIder = kontantstøttePeriodeModalSpørsmålSpråkId(
            personType,
            periodenErAvsluttet
        );
        return hentTekster(kontantstøttePeriodeSpørsmålSpråkIder(spørsmålId), {
            ...(barn && { barn: barn.navn }),
        });
    };

    return {
        label: hentTekster('ombarnet.trygdandreperioder.periode', {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarEøsKontantstøtteNå: mottarEøsKontantstøtteNå.svar
                ? {
                      label: hentSpørsmålTekstId(
                          KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå
                      ),
                      verdi: sammeVerdiAlleSpråk(mottarEøsKontantstøtteNå.svar),
                  }
                : null,
            kontantstøtteLand: {
                label: hentSpørsmålTekstId(KontantstøttePeriodeSpørsmålId.kontantstøtteLand),
                verdi: verdiCallbackAlleSpråk(
                    locale => kontantstøtteLand && landkodeTilSpråk(kontantstøtteLand.svar, locale)
                ),
            },
            fraDatoKontantstøttePeriode: {
                label: hentSpørsmålTekstId(
                    KontantstøttePeriodeSpørsmålId.fraDatoKontantstøttePeriode
                ),
                verdi: sammeVerdiAlleSpråk(fraDatoKontantstøttePeriode?.svar),
            },
            tilDatoKontantstøttePeriode: tilDatoKontantstøttePeriode.svar
                ? {
                      label: hentSpørsmålTekstId(
                          KontantstøttePeriodeSpørsmålId.tilDatoKontantstøttePeriode
                      ),
                      verdi: sammeVerdiAlleSpråk(tilDatoKontantstøttePeriode?.svar ?? null),
                  }
                : null,
            månedligBeløp: {
                label: hentSpørsmålTekstId(KontantstøttePeriodeSpørsmålId.månedligBeløp),
                verdi: sammeVerdiAlleSpråk(månedligBeløp.svar),
            },
        }),
    };
};
