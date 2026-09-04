import type { IBarnRespons } from '../../typer/person';

export function lagBarn(barn?: Partial<IBarnRespons>): IBarnRespons {
    return {
        ident: '2',
        adressebeskyttelse: false,
        navn: 'Barn',
        borMedSøker: true,
        fødselsdato: '2025-01-01',
        ...barn,
    };
}
