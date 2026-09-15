import { ESivilstand } from '../../../common/typer/kontrakt/generelle';
import type { ISøkerRespons } from '../../typer/person';

export function lagSøker(søker?: Partial<ISøkerRespons>): ISøkerRespons {
    return {
        ident: '1',
        adressebeskyttelse: false,
        navn: 'Navn',
        barn: [],
        statsborgerskap: [{ landkode: 'NOR' }],
        adresse: null,
        sivilstand: { type: ESivilstand.GIFT },
        ...søker,
    };
}
