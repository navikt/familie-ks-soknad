import React, { Dispatch, SetStateAction } from 'react';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../../context/EøsContext';
import { IBarnMedISøknad } from '../../../../typer/barn';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { skalSkjuleAndreForelderFelt } from '../../../../utils/barn';
import { IdNummer } from '../IdNummer';
import { idNummerLandMedPeriodeType } from '../idnummerUtils';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from './spørsmål';

const IdNummerForAndreForelder: React.FC<{
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    lesevisning?: boolean;
}> = ({ skjema, barn, settIdNummerFelter, lesevisning = false }) => {
    const { erEøsLand } = useEøs();

    if (!barn.andreForelder || skalSkjuleAndreForelderFelt(barn)) {
        return null;
    }

    const idNummerSomMåOppgisFraPerioder = idNummerLandMedPeriodeType(
        {
            pensjonsperioderUtland: barn.andreForelder.pensjonsperioderUtland,
            arbeidsperioderUtland: barn.andreForelder.arbeidsperioderUtland,
        },
        erEøsLand
    );

    return idNummerSomMåOppgisFraPerioder ? (
        <>
            {idNummerSomMåOppgisFraPerioder.map((landMedPeriodeType, index) => {
                return (
                    !!landMedPeriodeType.land && (
                        <IdNummer
                            key={index}
                            lesevisning={lesevisning}
                            spørsmålSpråkId={
                                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerAndreForelder]
                            }
                            spørsmålCheckboxSpråkId={
                                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerUkjent]
                            }
                            feilmeldingSpråkId={'eøs-om-barn.andreforelderidnummer.feilmelding'}
                            idNummerVerdiFraSøknad={
                                barn.andreForelder?.idNummer.find(
                                    verdi => verdi.land === landMedPeriodeType.land
                                )?.idnummer
                            }
                            skjema={skjema}
                            settIdNummerFelter={settIdNummerFelter}
                            landAlphaCode={landMedPeriodeType.land}
                            periodeType={landMedPeriodeType.periodeType}
                            barn={barn}
                        />
                    )
                );
            })}
        </>
    ) : null;
};
export default IdNummerForAndreForelder;
