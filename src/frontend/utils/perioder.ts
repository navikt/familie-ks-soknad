import {
    dagenEtterDato,
    dagensDato,
    erDatoFormatGodkjent,
    erSammeDatoSomDagensDato,
    morgendagensDato,
    stringTilDate,
} from './dato';

export const minTilDatoForPeriode = (periodenErAvsluttet: boolean, fraDato: string) => {
    const gyldigFraDato = fraDato !== '' && erDatoFormatGodkjent(stringTilDate(fraDato));
    if (periodenErAvsluttet) {
        return gyldigFraDato ? dagenEtterDato(stringTilDate(fraDato)) : undefined;
    } else if (gyldigFraDato && erSammeDatoSomDagensDato(stringTilDate(fraDato))) {
        return morgendagensDato();
    } else {
        return dagensDato();
    }
};
