import { Alpha3Code } from 'i18n-iso-countries';

import {
    IArbeidsperiode,
    IEøsBarnetrygdsperiode,
    IPensjonsperiode,
    IUtenlandsperiode,
} from '../../../typer/perioder';

export const idNummerKeyPrefix = '-idnummer-';

export enum PeriodeType {
    arbeidsperiode = 'arbeidsperiode',
    pensjonsperiode = 'pensjonsperiode',
    utenlandsperiode = 'utenlandsperiode',
    eøsBarnetrygdPeriode = 'eøsBarnetrygdPeriode',
}

export type IdNummerLandMedPeriodeType = {
    land: Alpha3Code | undefined | '';
    periodeType: PeriodeType;
};

export const fjernDuplikat = (landList: Alpha3Code[]): Alpha3Code[] =>
    landList.filter((land, index) => land && !landList.includes(land, index + 1));

export const eøsLandUtenDuplikatHof =
    (erEøsLand: (land: Alpha3Code | '') => boolean) =>
    (landListe: (Alpha3Code | '' | undefined)[]): Alpha3Code[] => {
        const eøsLand: Alpha3Code[] = landListe.filter(
            land => !!land && erEøsLand(land)
        ) as Alpha3Code[];
        return fjernDuplikat(eøsLand);
    };

export const idNummerLandMedPeriodeType = (
    perioder: {
        utenlandsperioder?: IUtenlandsperiode[];
        arbeidsperioderUtland?: IArbeidsperiode[];
        pensjonsperioderUtland?: IPensjonsperiode[];
        eøsBarnetrygdsperioder?: IEøsBarnetrygdsperiode[];
    },
    erEøsLand: (land: Alpha3Code | '') => boolean
): IdNummerLandMedPeriodeType[] => {
    const {
        arbeidsperioderUtland = [],
        pensjonsperioderUtland = [],
        utenlandsperioder = [],
        eøsBarnetrygdsperioder = [],
    } = perioder;

    const eøsLandUtenDuplikat = eøsLandUtenDuplikatHof(erEøsLand);

    const utenlandsperioderLandSomKreverIdNummer: Alpha3Code[] = eøsLandUtenDuplikat(
        utenlandsperioder.map(periode => periode.oppholdsland.svar)
    );

    // Gjelder kun barn
    const eøsBarnetrygsperioderLandSomKreverIdNummer: Alpha3Code[] = eøsLandUtenDuplikat(
        eøsBarnetrygdsperioder.map(periode => periode.barnetrygdsland.svar)
    ).filter(land => land && !utenlandsperioderLandSomKreverIdNummer.includes(land)); // Filtrer bort det som allerede finnes i utenlandsopphold

    // Gjelder kun søker
    const arbeidsperioderLandSomKreverIdNummer: Alpha3Code[] = eøsLandUtenDuplikat(
        arbeidsperioderUtland.map(periode => periode.arbeidsperiodeland?.svar)
    ).filter(land => land && !utenlandsperioderLandSomKreverIdNummer.includes(land)); // Filtrer bort det som allerede finnes i utenlandsopphold

    // Gjelder kun søker
    const pensjonsperioderLandSomKreverIdNummer: Alpha3Code[] = eøsLandUtenDuplikat(
        pensjonsperioderUtland.map(periode => periode.pensjonsland?.svar)
    ).filter(
        //Filtrer bort det som allerede finnes i arbeidsperioder og utenlandsopphold
        land =>
            land &&
            !arbeidsperioderLandSomKreverIdNummer.includes(land) &&
            !utenlandsperioderLandSomKreverIdNummer.includes(land)
    );

    const mapArbeidTilIdNummerLandMedPeriodeType: IdNummerLandMedPeriodeType[] =
        arbeidsperioderLandSomKreverIdNummer.map(land => ({
            land,
            periodeType: PeriodeType.arbeidsperiode,
        }));
    const mapEøsBarnetrygdTilIdNummerLandMedPeriodeType: IdNummerLandMedPeriodeType[] =
        eøsBarnetrygsperioderLandSomKreverIdNummer.map(land => ({
            land,
            periodeType: PeriodeType.eøsBarnetrygdPeriode,
        }));
    const mapPensjonTilIdNummerLandMedPeriodeType: IdNummerLandMedPeriodeType[] =
        pensjonsperioderLandSomKreverIdNummer.map(land => ({
            land,
            periodeType: PeriodeType.pensjonsperiode,
        }));
    const mapUtenlandsppholdTilIdNummerLandMedPeriodeType: IdNummerLandMedPeriodeType[] =
        utenlandsperioderLandSomKreverIdNummer.map(land => ({
            land,
            periodeType: PeriodeType.utenlandsperiode,
        }));

    return [
        ...mapArbeidTilIdNummerLandMedPeriodeType,
        ...mapEøsBarnetrygdTilIdNummerLandMedPeriodeType,
        ...mapPensjonTilIdNummerLandMedPeriodeType,
        ...mapUtenlandsppholdTilIdNummerLandMedPeriodeType,
    ];
};

export const idNummerLand = (
    perioder: {
        arbeidsperioderUtland?: IArbeidsperiode[];
        pensjonsperioderUtland?: IPensjonsperiode[];
        utenlandsperioder?: IUtenlandsperiode[];
    },
    erEøsLand: (land: Alpha3Code | '') => boolean
) => {
    const {
        arbeidsperioderUtland = [],
        pensjonsperioderUtland = [],
        utenlandsperioder = [],
    } = perioder;
    return idNummerLandMedPeriodeType(
        {
            arbeidsperioderUtland,
            pensjonsperioderUtland,
            utenlandsperioder,
        },
        erEøsLand
    ).map(landMedPeriode => landMedPeriode.land);
};
