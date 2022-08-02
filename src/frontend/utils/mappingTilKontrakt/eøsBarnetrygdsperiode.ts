import { ESvar } from '@navikt/familie-form-elements';

import { barnetrygdperiodeModalSpørsmålSpråkId } from '../../components/Felleskomponenter/Barnetrygdperiode/barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from '../../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IEøsBarnetrygdsperiodeIKontraktFormat } from '../../typer/kontrakt/v1';
import { IEøsBarnetrygdsperiode } from '../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../typer/personType';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface PensjonperiodeIKontraktFormatParams {
    periode: IEøsBarnetrygdsperiode;
    periodeNummer: number;
    barn: IBarnMedISøknad;
}

export const tilIEøsBarnetrygsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    barn,
    personType,
    erDød,
}: PensjonperiodeIKontraktFormatParams &
    PeriodePersonTypeProps): ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormat> => {
    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = periode;
    const periodenErAvsluttet =
        mottarEøsBarnetrygdNå.svar === ESvar.NEI ||
        (personType === PersonType.AndreForelder && erDød);

    const hentSpørsmålTekstId = (spørsmålId: BarnetrygdperiodeSpørsmålId) => {
        const barnetrygdperiodeSpørsmålSpråkIder = barnetrygdperiodeModalSpørsmålSpråkId(
            personType,
            periodenErAvsluttet
        );
        return hentTekster(barnetrygdperiodeSpørsmålSpråkIder(spørsmålId), {
            ...(barn && { barn: barn.navn }),
        });
    };

    return {
        label: hentTekster('ombarnet.trygdandreperioder.periode', {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarEøsBarnetrygdNå: mottarEøsBarnetrygdNå.svar
                ? {
                      label: hentSpørsmålTekstId(BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå),
                      verdi: sammeVerdiAlleSpråk(mottarEøsBarnetrygdNå.svar),
                  }
                : null,
            barnetrygdsland: {
                label: hentSpørsmålTekstId(BarnetrygdperiodeSpørsmålId.barnetrygdsland),
                verdi: verdiCallbackAlleSpråk(
                    locale => barnetrygdsland && landkodeTilSpråk(barnetrygdsland.svar, locale)
                ),
            },
            fraDatoBarnetrygdperiode: {
                label: hentSpørsmålTekstId(BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode),
                verdi: sammeVerdiAlleSpråk(fraDatoBarnetrygdperiode?.svar),
            },
            tilDatoBarnetrygdperiode: tilDatoBarnetrygdperiode.svar
                ? {
                      label: hentSpørsmålTekstId(
                          BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode
                      ),
                      verdi: sammeVerdiAlleSpråk(tilDatoBarnetrygdperiode?.svar ?? null),
                  }
                : null,
            månedligBeløp: {
                label: hentSpørsmålTekstId(BarnetrygdperiodeSpørsmålId.månedligBeløp),
                verdi: sammeVerdiAlleSpråk(månedligBeløp.svar),
            },
        }),
    };
};
