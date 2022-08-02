import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/barn';
import { IOmsorgsperson } from '../../../typer/omsorgsperson';
import { IOmBarnaDineFeltTyper } from '../../../typer/skjema';
import { ISøknad } from '../../../typer/søknad';
import {
    filtrerteRelevanteIdNummerForBarn,
    genererInitiellAndreForelder,
    nullstilteEøsFelterForBarn,
    skalViseBorMedOmsorgsperson,
} from '../../../utils/barn';
import { EøsBarnSpørsmålId } from '../EøsSteg/Barn/spørsmål';

export const genererSvarForSpørsmålBarn = (barn: IBarnMedISøknad, felt: Felt<string[]>): ESvar =>
    felt.verdi.includes(barn.id) ? ESvar.JA : ESvar.NEI;

export const genererSvarForOppfølgningspørsmålBarn = (
    svarPåGrunnSpørsmål,
    søknadsfelt,
    nullstillingsVerdi
) => {
    return svarPåGrunnSpørsmål === ESvar.JA ? søknadsfelt.svar : nullstillingsVerdi;
};

export const genererOppdaterteBarn = (
    søknad: ISøknad,
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>,
    skalTriggeEøsForBarn: (barn: IBarnMedISøknad) => boolean,
    erEøsLand: (land: Alpha3Code | '') => boolean
): IBarnMedISøknad[] => {
    return søknad.barnInkludertISøknaden.map((barn): IBarnMedISøknad => {
        const oppholderSegIInstitusjon: ESvar = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemOppholderSegIInstitusjon
        );

        const boddMindreEnn12MndINorge: ESvar = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemTolvMndSammenhengendeINorge
        );

        const mottarBarnetrygdFraAnnetEøsland: ESvar = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemBarnetrygdFraAnnetEøsland
        );
        const andreForelderErDød: ESvar = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemAvdødPartner
        );

        const erFosterbarn: ESvar = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemErFosterbarn
        );

        const utenlandsperioder =
            boddMindreEnn12MndINorge === ESvar.JA ? barn.utenlandsperioder : [];
        const eøsBarnetrygdsperioder =
            mottarBarnetrygdFraAnnetEøsland === ESvar.JA ? barn.eøsBarnetrygdsperioder : [];

        const pågåendeSøknadFraAnnetEøsLand: ESvar | null = genererSvarForOppfølgningspørsmålBarn(
            mottarBarnetrygdFraAnnetEøsland,
            barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand],
            null
        );

        const pågåendeSøknadHvilketLand: Alpha3Code | '' = genererSvarForOppfølgningspørsmålBarn(
            mottarBarnetrygdFraAnnetEøsland,
            barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand],
            ''
        );

        const borMedAnnenForelderErIkkeRelevant = () =>
            erFosterbarn === ESvar.JA ||
            oppholderSegIInstitusjon === ESvar.JA ||
            andreForelderErDød === ESvar.JA;

        const borMedAndreForelder = borMedAnnenForelderErIkkeRelevant()
            ? null
            : barn.borMedAndreForelder.svar;

        const borMedOmsorgsperson: ESvar | null = skalViseBorMedOmsorgsperson(
            borMedAndreForelder,
            barn.borFastMedSøker.svar,
            oppholderSegIInstitusjon,
            andreForelderErDød,
            erFosterbarn
        )
            ? barn[barnDataKeySpørsmål.borMedOmsorgsperson].svar
            : null;

        const omsorgsperson: IOmsorgsperson | null =
            barn.omsorgsperson && borMedOmsorgsperson === ESvar.JA
                ? {
                      ...barn.omsorgsperson,
                      ...(erFosterbarn === ESvar.JA && {
                          slektsforhold: { ...barn.omsorgsperson?.slektsforhold, svar: '' },
                          slektsforholdSpesifisering: {
                              ...barn.omsorgsperson?.slektsforholdSpesifisering,
                              svar: '',
                          },
                      }),
                  }
                : null;

        const oppdatertBarn = {
            ...barn,
            idNummer: filtrerteRelevanteIdNummerForBarn(
                { eøsBarnetrygdsperioder, utenlandsperioder },
                pågåendeSøknadFraAnnetEøsLand,
                pågåendeSøknadHvilketLand,
                barn,
                erEøsLand
            ),
            utenlandsperioder,
            eøsBarnetrygdsperioder,
            andreForelder:
                erFosterbarn === ESvar.JA
                    ? null
                    : genererInitiellAndreForelder(
                          barn.andreForelder,
                          andreForelderErDød === ESvar.JA
                      ),
            omsorgsperson,
            [barnDataKeySpørsmål.borMedAndreForelder]: {
                ...barn[barnDataKeySpørsmål.borMedAndreForelder],
                svar: borMedAndreForelder,
            },
            [barnDataKeySpørsmål.søkersSlektsforhold]: {
                id: EøsBarnSpørsmålId.søkersSlektsforhold,
                svar: erFosterbarn === ESvar.JA ? '' : barn.søkersSlektsforhold.svar,
            },
            [barnDataKeySpørsmål.søkersSlektsforholdSpesifisering]: {
                id: EøsBarnSpørsmålId.søkersSlektsforholdSpesifisering,
                svar: erFosterbarn === ESvar.JA ? '' : barn.søkersSlektsforholdSpesifisering.svar,
            },
            [barnDataKeySpørsmål.borMedOmsorgsperson]: {
                ...barn[barnDataKeySpørsmål.borMedOmsorgsperson],
                svar: borMedOmsorgsperson,
            },
            [barnDataKeySpørsmål.erFosterbarn]: {
                ...barn[barnDataKeySpørsmål.erFosterbarn],
                svar: erFosterbarn,
            },
            [barnDataKeySpørsmål.erAsylsøker]: {
                ...barn[barnDataKeySpørsmål.erAsylsøker],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErSøktAsylFor),
            },
            [barnDataKeySpørsmål.erAdoptertFraUtland]: {
                ...barn[barnDataKeySpørsmål.erAdoptertFraUtland],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErAdoptertFraUtland),
            },
            [barnDataKeySpørsmål.oppholderSegIInstitusjon]: {
                ...barn[barnDataKeySpørsmål.oppholderSegIInstitusjon],
                svar: oppholderSegIInstitusjon,
            },
            [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: {
                ...barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge],
                svar: boddMindreEnn12MndINorge,
            },
            [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
                ...barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland],
                svar: mottarBarnetrygdFraAnnetEøsland,
            },
            [barnDataKeySpørsmål.andreForelderErDød]: {
                ...barn[barnDataKeySpørsmål.andreForelderErDød],
                svar: andreForelderErDød,
            },
            [barnDataKeySpørsmål.institusjonIUtland]: {
                ...barn[barnDataKeySpørsmål.institusjonIUtland],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonIUtland],
                    ESvar.NEI
                ),
            },
            [barnDataKeySpørsmål.institusjonsnavn]: {
                ...barn[barnDataKeySpørsmål.institusjonsnavn],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonsnavn],
                    ''
                ),
            },
            [barnDataKeySpørsmål.institusjonsadresse]: {
                ...barn[barnDataKeySpørsmål.institusjonsadresse],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonsadresse],
                    ''
                ),
            },
            [barnDataKeySpørsmål.institusjonspostnummer]: {
                ...barn[barnDataKeySpørsmål.institusjonspostnummer],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonspostnummer],
                    ''
                ),
            },
            [barnDataKeySpørsmål.institusjonOppholdStartdato]: {
                ...barn[barnDataKeySpørsmål.institusjonOppholdStartdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonOppholdStartdato],
                    ''
                ),
            },
            [barnDataKeySpørsmål.institusjonOppholdSluttdato]: {
                ...barn[barnDataKeySpørsmål.institusjonOppholdSluttdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonOppholdSluttdato],
                    ''
                ),
            },
            [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: {
                ...barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    boddMindreEnn12MndINorge,
                    barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
                    null
                ),
            },
            [barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd]: {
                ...barn[barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    mottarBarnetrygdFraAnnetEøsland,
                    barn[barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd],
                    null
                ),
            },
            [barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: {
                ...barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand],
                svar: pågåendeSøknadFraAnnetEøsLand,
            },
            [barnDataKeySpørsmål.pågåendeSøknadHvilketLand]: {
                ...barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand],
                svar: pågåendeSøknadHvilketLand,
            },
            [barnDataKeySpørsmål.adresse]: {
                ...barn[barnDataKeySpørsmål.adresse],
                svar:
                    erFosterbarn === ESvar.JA ||
                    (barn.andreForelder?.kanIkkeGiOpplysninger &&
                        barn.borMedAndreForelder.svar === ESvar.JA)
                        ? barn.adresse.svar
                        : '',
            },
        };

        const barnTriggetEøs = skalTriggeEøsForBarn(oppdatertBarn);
        const harEøsSteg = barnTriggetEøs || søknad.søker.triggetEøs;

        return {
            ...oppdatertBarn,
            triggetEøs: barnTriggetEøs,
            ...(!harEøsSteg && nullstilteEøsFelterForBarn(oppdatertBarn)),
        };
    });
};
