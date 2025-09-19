import { PersonType } from '../../../typer/personType';
import { ESanitySteg, ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

import { KontantstøttePeriodeSpørsmålId } from './spørsmål';

export const eøsKontantstøtteSpørsmålsdokument = (
    personType: Exclude<PersonType, PersonType.barn>,
    tekster: ITekstinnhold,
    erDød?: boolean
): ISanitySpørsmålDokument => {
    switch (personType) {
        case PersonType.andreForelder: {
            return erDød
                ? tekster[ESanitySteg.EØS_FOR_BARN].ytelseFraAnnetLandAndreForelderGjenlevende
                : tekster[ESanitySteg.EØS_FOR_BARN].ytelseFraAnnetLandAndreForelder;
        }
        case PersonType.omsorgsperson: {
            return tekster[ESanitySteg.EØS_FOR_BARN].ytelseFraAnnetLandOmsorgsperson;
        }
        case PersonType.søker:
            return tekster[ESanitySteg.OM_BARNET].faarEllerHarFaattYtelseFraAnnetLand;
    }
};

const kontantstøttePeriodeFellesSpørsmålSpråkId: Record<
    Exclude<
        KontantstøttePeriodeSpørsmålId,
        KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå | KontantstøttePeriodeSpørsmålId.kontantstøtteLand
    >,
    string
> = {
    [KontantstøttePeriodeSpørsmålId.kontantstøttePeriodeEøs]: 'modal.trygdandreperioder.tittel',
    [KontantstøttePeriodeSpørsmålId.fraDatoKontantstøttePeriode]: 'modal.trygdnårbegynte.spm',
    [KontantstøttePeriodeSpørsmålId.tilDatoKontantstøttePeriode]: 'modal.trygdnåravsluttet.spm',
    [KontantstøttePeriodeSpørsmålId.månedligBeløp]: 'ombarnet.trygdbeløp.spm',
};

export const kontantstøttePeriodeSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<KontantstøttePeriodeSpørsmålId, string> => ({
    [KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå]: 'modal.barnetrygdnå.spm',
    [KontantstøttePeriodeSpørsmålId.kontantstøtteLand]: periodenErAvsluttet
        ? 'modal.hvilketlandbarnetrygd.spm'
        : 'ombarnet.hvilketlandfår.spm',
    ...kontantstøttePeriodeFellesSpørsmålSpråkId,
});

export const kontantstøttePeriodeAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<KontantstøttePeriodeSpørsmålId, string> => ({
    [KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå]: 'modal.barnetrygdnå-annenforelder.spm',
    [KontantstøttePeriodeSpørsmålId.kontantstøtteLand]: periodenErAvsluttet
        ? 'modal.annenforelder-barnetrygd-fortid.spm'
        : 'modal.annenforelder-barnetrygd-nåtid.spm',
    ...kontantstøttePeriodeFellesSpørsmålSpråkId,
});

export const kontantstøttePeriodeOmsorgspersonSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<KontantstøttePeriodeSpørsmålId, string> => ({
    [KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå]: 'modal.barnetrygdnå-omsorgsperson.spm',
    [KontantstøttePeriodeSpørsmålId.kontantstøtteLand]: periodenErAvsluttet
        ? 'modal.omsorgsperson-barnetrygd-fortid.spm'
        : 'modal.omsorgsperson-barnetrygd-nåtid.spm',
    ...kontantstøttePeriodeFellesSpørsmålSpråkId,
});

export const kontantstøttePeriodeModalSpørsmålSpråkId =
    (personType: PersonType, periodenErAvsluttet: boolean) =>
    (spørsmålId: KontantstøttePeriodeSpørsmålId): string => {
        switch (personType) {
            case PersonType.andreForelder:
                return kontantstøttePeriodeAndreForelderSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            case PersonType.omsorgsperson: {
                return kontantstøttePeriodeOmsorgspersonSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
            }
            case PersonType.søker:
            default:
                return kontantstøttePeriodeSøkerSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
        }
    };
