import React, { Dispatch, SetStateAction } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import styled from 'styled-components';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../../context/EøsContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { skalSpørreOmIdNummerForPågåendeSøknadEøsLand } from '../../../../utils/barn';
import { IdNummer } from '../IdNummer';
import { idNummerLandMedPeriodeType, PeriodeType } from '../idnummerUtils';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from './spørsmål';

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
    return (
        <IdNummer
            lesevisning={lesevisning}
            spørsmålSpråkId={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummer]}
            spørsmålCheckboxSpråkId={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerUkjent]}
            feilmeldingSpråkId={'eøs-om-barn.barnidnummer.feilmelding'}
            idNummerVerdiFraSøknad={
                barn.idNummer.find(verdi => verdi.land === landAlphaCode)?.idnummer
            }
            skjema={skjema}
            settIdNummerFelter={settIdNummerFelter}
            landAlphaCode={landAlphaCode}
            periodeType={periodeType}
            barn={barn}
        />
    );
};

const SamleIdNummerContainer = styled.div<{ lesevisning: boolean }>`
    margin-bottom: ${props => (props.lesevisning ? '2.5rem' : '4rem')};
`;

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
            eøsBarnetrygdsperioder: barn.eøsBarnetrygdsperioder,
        },
        erEøsLand
    );

    return skalSpørreOmIdNummerForPågåendeSøknad || idNummerSomMåOppgisFraPerioder.length ? (
        <SamleIdNummerContainer lesevisning={lesevisning}>
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
        </SamleIdNummerContainer>
    ) : null;
};

export default SamletIdNummerForBarn;
