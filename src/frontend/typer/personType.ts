import { IBarnMedISøknad } from './barn';

export enum PersonType {
    andreForelder = 'andreForelder',
    omsorgsperson = 'omsorgsperson',
    søker = 'søker',
    barn = 'barn',
}

export type PeriodePersonTypeMedBarnProps =
    | { personType: PersonType.søker; barn?: never; erDød?: never }
    | { personType: PersonType.omsorgsperson; barn: IBarnMedISøknad; erDød?: never }
    | { personType: PersonType.andreForelder; barn: IBarnMedISøknad; erDød: boolean };

export type PeriodePersonTypeProps =
    | { personType: PersonType.søker; erDød?: never }
    | { personType: PersonType.omsorgsperson; erDød?: never }
    | { personType: PersonType.andreForelder; erDød: boolean };
