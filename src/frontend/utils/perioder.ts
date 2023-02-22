import {
    dagenEtterDato,
    dagensDato,
    erDatoFormatGodkjent,
    erSammeDatoSomDagensDato,
    morgendagensDato,
} from './dato';

export const minTilDatoForUtbetalingEllerArbeidsperiode = (
    periodenErAvsluttet: boolean,
    fraDato: string
) => {
    const gyldigFraDato = fraDato !== '' && erDatoFormatGodkjent(new Date(fraDato));
    if (periodenErAvsluttet) {
        return gyldigFraDato ? dagenEtterDato(new Date(fraDato)) : undefined;
    } else if (gyldigFraDato && erSammeDatoSomDagensDato(new Date(fraDato))) {
        return morgendagensDato();
    } else {
        return dagensDato();
    }
};
