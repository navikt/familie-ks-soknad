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

export const årsakSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.oppholdalternativ.flyttettilnorge',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.oppholdalternativ.flyttetfranorge',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'modal.oppholdalternativ.oppholdtidligere',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.oppholdalternativ.utenfornå',
};

export const årsakSpråkIdsBarn: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]:
        'ombarnet.oppholdalternativ.flyttettilnorge',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]:
        'ombarnet.oppholdalternativ.flyttetfranorge',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'ombarnet.oppholdalternativ.oppholdtidligere',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'ombarnet.oppholdalternativ.utenfornå',
};

export const landLabelSpråkIdsBarn: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'ombarnet.hvilketlandflyttetfra.spm',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'ombarnet.hvilketlandflyttettil.spm',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]: 'ombarnet.hvilketlandoppholdti.spm',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'ombarnet.hvilketlandoppholderi.spm',
};

export const landLabelSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.hvilketlandflyttetfra.spm',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.hvilketlandflyttettil.spm',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]: 'modal.hvilketlandoppholdti.spm',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.hvilketlandoppholderi.spm',
};

export const landFeilmeldingSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.hvilketlandflyttetfra.feilmelding',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.hvilketlandflyttettil.feilmelding',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'modal.hvilketlandoppholdti.feilmelding',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.hvilketlandoppholderi.feilmelding',
};
