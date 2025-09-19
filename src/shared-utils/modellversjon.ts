import { type ApiRessurs, RessursStatus } from '@navikt/familie-typer';

export const modellVersjon = 4;

export const modellVersjonHeaderName = 'Soknad-Modell-Versjon';

export const modellMismatchMelding = 'UTDATERT_MODELL';

export interface ModellMismatchRespons {
    modellVersjon: number;
}

export const erModellMismatchResponsRessurs = (ressurs: unknown): ressurs is ApiRessurs<ModellMismatchRespons> => {
    if (!ressurs || typeof ressurs !== 'object') {
        return false;
    }

    const erModellMismatchMelding = 'melding' in ressurs && ressurs.melding === modellMismatchMelding;

    const harRessursStatusFeilet = 'status' in ressurs && ressurs.status === RessursStatus.FEILET;

    return erModellMismatchMelding && harRessursStatusFeilet;
};
