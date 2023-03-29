import { IBarnMedISøknad } from './barn';

export enum PersonType {
    andreForelder = 'andreForelder',
    omsorgsperson = 'omsorgsperson',
    søker = 'søker',
    barn = 'barn',
}

export type PeriodePersonTypeMedBarnProps =
    | { personType: PersonType.søker; erDød?: boolean; barn?: IBarnMedISøknad | undefined }
    | { personType: PersonType.omsorgsperson; erDød?: boolean; barn: IBarnMedISøknad | undefined }
    | { personType: PersonType.andreForelder; erDød: boolean; barn: IBarnMedISøknad | undefined }
    | { personType: PersonType.barn; erDød?: boolean; barn?: IBarnMedISøknad | undefined };

export type PeriodePersonTypeProps =
    | { personType: PersonType.søker; erDød?: never }
    | { personType: PersonType.omsorgsperson; erDød?: never }
    | { personType: PersonType.andreForelder; erDød: boolean };
