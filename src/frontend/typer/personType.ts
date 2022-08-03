import { IBarnMedISøknad } from './barn';

export enum PersonType {
    AndreForelder = 'AndreForelder',
    Omsorgsperson = 'Omsorgsperson',
    Søker = 'Søker',
}

export type PeriodePersonTypeMedBarnProps =
    | { personType: PersonType.Søker; barn?: never; erDød?: never }
    | { personType: PersonType.Omsorgsperson; barn: IBarnMedISøknad; erDød?: never }
    | { personType: PersonType.AndreForelder; barn: IBarnMedISøknad; erDød: boolean };

export type PeriodePersonTypeProps =
    | { personType: PersonType.Søker; erDød?: never }
    | { personType: PersonType.Omsorgsperson; erDød?: never }
    | { personType: PersonType.AndreForelder; erDød: boolean };
