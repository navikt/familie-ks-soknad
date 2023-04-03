import React, { Dispatch, SetStateAction } from 'react';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import { useEøs } from '../../../../context/EøsContext';
import { IBarnMedISøknad } from '../../../../typer/barn';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { skalSkjuleAndreForelderFelt } from '../../../../utils/barn';
import { IdNummer } from '../IdNummer';
import { idNummerLandMedPeriodeType } from '../idnummerUtils';

const IdNummerForAndreForelder: React.FC<{
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    lesevisning?: boolean;
}> = ({ skjema, barn, settIdNummerFelter, lesevisning = false }) => {
    const { erEøsLand } = useEøs();
    const { tekster } = useApp();

    if (!barn.andreForelder || skalSkjuleAndreForelderFelt(barn)) {
        return null;
    }

    const idNummerSomMåOppgisFraPerioder = idNummerLandMedPeriodeType(
        {
            pensjonsperioderUtland: barn.andreForelder.pensjonsperioderUtland,
            arbeidsperioderUtland: barn.andreForelder.arbeidsperioderUtland,
            utenlandsperioder: barn.andreForelder.utenlandsperioder,
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
                            spørsmålDokument={tekster().EØS_FOR_BARN.idNummerAndreForelder}
                        />
                    )
                );
            })}
        </>
    ) : null;
};
export default IdNummerForAndreForelder;
