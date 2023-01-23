enum IdentType {
    DNR_AND_HNR,
    DNR,
    TNR,
    HNR,
    FNR,
}

// Kopiert fra https://github.com/navikt/fnrvalidator/blob/master/src/validator.js
const getIdentType = (digits: string): IdentType => {
    if (Number(digits.substring(0, 1)) >= 4 && Number(digits.substring(2, 3)) >= 4) {
        return IdentType.DNR_AND_HNR;
    } else if (Number(digits.substring(0, 1)) >= 4) {
        return IdentType.DNR;
    } else if (Number(digits.substring(2, 3)) >= 8) {
        return IdentType.TNR;
    } else if (Number(digits.substring(2, 3)) >= 4) {
        return IdentType.HNR;
    }
    return IdentType.FNR;
};
// Kopiert fra https://github.com/navikt/fnrvalidator/blob/master/src/validator.js
export const identTilFødselsdato = (ident: string): string => {
    const type = getIdentType(ident);
    console.log(type);
    let fnr = '';
    switch (type) {
        case IdentType.DNR:
            fnr = Number(ident.substring(0, 1)) - 4 + ident.substring(1);
            break;
        case IdentType.HNR:
            fnr = ident.substring(0, 2) + (Number(ident.substring(2, 3)) - 4) + ident.substring(3);
            break;
        case IdentType.TNR:
            fnr = ident.substring(0, 2) + (Number(ident.substring(2, 3)) - 8) + ident.substring(3);
            break;
        case IdentType.DNR_AND_HNR:
            fnr =
                Number(ident.substring(0, 1)) -
                4 +
                ident.substring(1, 2) +
                (Number(ident.substring(2, 3)) - 4) +
                ident.substring(3);
            break;
        default:
            fnr = ident;
    }

    const dag = Number(fnr.substring(0, 2));
    const mnd = Number(fnr.substring(2, 4));
    const år = Number(fnr.substring(4, 6));
    const individnummer = Number(fnr.substring(6, 9));

    const fulltÅrstall = bestemÅrstall(år, individnummer);

    return datoTilDatoString(fulltÅrstall, mnd, dag);
};

// https://www.skatteetaten.no/person/folkeregister/fodsel-og-navnevalg/barn-fodt-i-norge/fodselsnummer/
const bestemÅrstall = (fødselsårIFnr: number, individNummer: number): number => {
    if (individnummerGyldigForIntervallOgÅr(500, 759, individNummer, () => fødselsårIFnr > 54)) {
        return 1800 + fødselsårIFnr;
    } else if (individnummerGyldigForIntervallOgÅr(0, 499, individNummer)) {
        return 1900 + fødselsårIFnr;
    } else if (
        individnummerGyldigForIntervallOgÅr(900, 999, individNummer, () => fødselsårIFnr > 39)
    ) {
        return 1900 + fødselsårIFnr;
    } else if (
        individnummerGyldigForIntervallOgÅr(500, 999, individNummer, () => fødselsårIFnr < 40)
    ) {
        return 2000 + fødselsårIFnr;
    } else {
        throw new Error('Individnummer og fødselsår i fnr passer ikke inn i gyldige intervaller');
    }
};

const individnummerGyldigForIntervallOgÅr = (
    min: number,
    max: number,
    individNummer: number,
    triggerForFødselsår?: () => boolean
): boolean =>
    individNummer >= min &&
    individNummer <= max &&
    (triggerForFødselsår ? triggerForFødselsår() : true);

const datoTilDatoString = (år: number, mnd: number, dag: number) =>
    år + '-' + ('0' + mnd).slice(-2) + '-' + ('0' + dag).slice(-2);
