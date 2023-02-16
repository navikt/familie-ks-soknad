import { ApiRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';

export const modellVersjon = 2;

export const modellVersjonHeaderName = 'Soknad-Modell-Versjon';

export const modellMismatchMelding = 'UTDATERT_MODELL';

export interface ModellMismatchRespons {
    modellVersjon: number;
}

export const erModellMismatchResponsRessurs = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ressurs: ApiRessurs<any> | Ressurs<any>
): ressurs is ApiRessurs<ModellMismatchRespons> => {
    if (!(typeof ressurs !== 'object' || 'melding' in ressurs)) {
        return false;
    }

    return ressurs.melding === modellMismatchMelding && ressurs.status === RessursStatus.FEILET;
};
