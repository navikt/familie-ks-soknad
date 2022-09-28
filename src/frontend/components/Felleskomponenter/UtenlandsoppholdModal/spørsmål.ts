import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';

export enum UtenlandsoppholdSpørsmålId {
    årsakUtenlandsopphold = 'årsak-utenlandsopphold',
    landUtenlandsopphold = 'land-utenlandsopphold',
    fraDatoUtenlandsopphold = 'fra-dato-utenlandsopphold',
    tilDatoUtenlandsopphold = 'til-dato-utenlandsopphold',
    tilDatoUtenlandsoppholdVetIkke = 'til-dato-utenlandsopphold-vet-ikke',
    utenlandsopphold = 'utenlandsopphold',
}

export const tilDatoUkjentLabelSpråkId = 'felles.vetikkenåravsluttes.spm';

export const landFeilmeldingSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.hvilketlandflyttetfra.feilmelding',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.hvilketlandflyttettil.feilmelding',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'modal.hvilketlandoppholdti.feilmelding',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.hvilketlandoppholderi.feilmelding',
};
