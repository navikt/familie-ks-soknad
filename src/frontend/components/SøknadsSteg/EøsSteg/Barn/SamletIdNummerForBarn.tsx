import React, { Dispatch, SetStateAction } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../../context/AppContext';
import { useEøs } from '../../../../context/EøsContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { skalSpørreOmIdNummerForPågåendeSøknadEøsLand } from '../../../../utils/barn';
import { IdNummer } from '../IdNummer';
import { idNummerLandMedPeriodeType, PeriodeType } from '../idnummerUtils';

const IdNummerForBarn: React.FC<{
    landAlphaCode: Alpha3Code | '';
    periodeType?: PeriodeType;
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    lesevisning: boolean;
}> = ({
    landAlphaCode,
    skjema,
    barn,
    settIdNummerFelter,
    periodeType = undefined,
    lesevisning = false,
}) => {
    const { tekster } = useAppContext();
    return (
        <IdNummer
            lesevisning={lesevisning}
            idNummerVerdiFraSøknad={
                barn.idNummer.find(verdi => verdi.land === landAlphaCode)?.idnummer
            }
            skjema={skjema}
            settIdNummerFelter={settIdNummerFelter}
            landAlphaCode={landAlphaCode}
            periodeType={periodeType}
            barn={barn}
            spørsmålDokument={tekster().EØS_FOR_BARN.idNummerBarn}
        />
    );
};

const SamletIdNummerForBarn: React.FC<{
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    lesevisning?: boolean;
}> = ({ barn, skjema, settIdNummerFelter, lesevisning = false }) => {
    const { erEøsLand } = useEøs();

    const skalSpørreOmIdNummerForPågåendeSøknad = skalSpørreOmIdNummerForPågåendeSøknadEøsLand(
        barn,
        erEøsLand
    );
    const idNummerSomMåOppgisFraPerioder = idNummerLandMedPeriodeType(
        {
            utenlandsperioder: barn.utenlandsperioder,
            eøsKontantstøttePerioder: barn.eøsKontantstøttePerioder,
        },
        erEøsLand
    );

    return skalSpørreOmIdNummerForPågåendeSøknad || idNummerSomMåOppgisFraPerioder.length ? (
        <>
            {idNummerSomMåOppgisFraPerioder.map((landMedPeriodeType, index) => {
                return (
                    !!landMedPeriodeType.land && (
                        <IdNummerForBarn
                            lesevisning={lesevisning}
                            skjema={skjema}
                            key={index}
                            settIdNummerFelter={settIdNummerFelter}
                            landAlphaCode={landMedPeriodeType.land}
                            periodeType={landMedPeriodeType.periodeType}
                            barn={barn}
                        />
                    )
                );
            })}
            {skalSpørreOmIdNummerForPågåendeSøknad && (
                <IdNummerForBarn
                    lesevisning={lesevisning}
                    skjema={skjema}
                    settIdNummerFelter={settIdNummerFelter}
                    landAlphaCode={barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar}
                    barn={barn}
                />
            )}
        </>
    ) : null;
};

export default SamletIdNummerForBarn;
