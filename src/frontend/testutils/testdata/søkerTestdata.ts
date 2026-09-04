import { ESivilstand } from '../../../common/typer/kontrakt/generelle';
import type { ISøkerRespons } from '../../typer/person';

import { lagBarn } from './barnTestdata';

export function lagSøker(søker?: Partial<ISøkerRespons>): ISøkerRespons {
    return {
        ident: '1',
        adressebeskyttelse: false,
        navn: 'Søker',
        barn: [lagBarn()],
        statsborgerskap: [{ landkode: 'NOR' }],
        adresse: null,
        sivilstand: { type: ESivilstand.GIFT },
        ...søker,
    };
}
