import React, { ChangeEvent, useEffect, useState } from 'react';

import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { BarnetsId } from '../../../typer/common';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface Props {
    legendSpråkId: string;
    skjemafelt: Felt<BarnetsId[]>;
    visFeilmelding: boolean;
    søknadsdatafelt: barnDataKeySpørsmål;
    nullstillValgteBarn: boolean;
}

const HvilkeBarnCheckboxGruppe: React.FC<Props> = ({
    legendSpråkId,
    skjemafelt,
    søknadsdatafelt,
    nullstillValgteBarn,
    visFeilmelding,
    children,
}) => {
    const { søknad } = useApp();
    const [valgteBarn, settValgteBarn] = useState<BarnetsId[]>(
        søknad.barnInkludertISøknaden
            .filter(barn => barn[søknadsdatafelt].svar === ESvar.JA)
            .map(barn => barn.id)
    );

    useEffect(() => {
        skjemafelt.hentNavInputProps(false).onChange(valgteBarn);
    }, [valgteBarn]);

    useEffect(() => {
        nullstillValgteBarn && settValgteBarn([]);
    }, [nullstillValgteBarn]);

    const oppdaterListeMedBarn = async (event: ChangeEvent, barnetsId: BarnetsId) => {
        const barnetFinnesIListen = !!valgteBarn.find(id => id === barnetsId);
        const barnChecked = (event.target as HTMLInputElement).checked;

        // Legg til barn i listen i lokal state
        if (barnChecked && !barnetFinnesIListen) {
            settValgteBarn(prevState => [...prevState].concat(barnetsId));
        }

        // Fjern barn fra listen i lokal state
        if (!barnChecked && barnetFinnesIListen) {
            settValgteBarn(prevState => [...prevState].filter(id => id !== barnetsId));
        }
    };

    return skjemafelt.erSynlig ? (
        <>
            <CheckboxGruppe
                aria-live={'polite'}
                legend={
                    <Element>
                        <SpråkTekst id={legendSpråkId} />
                    </Element>
                }
                {...skjemafelt.hentNavBaseSkjemaProps(visFeilmelding)}
                utenFeilPropagering
            >
                {søknad.barnInkludertISøknaden.map((barnISøknad, index) => {
                    return (
                        <Checkbox
                            key={index}
                            label={barnISøknad.navn}
                            defaultChecked={!!valgteBarn.find(barnId => barnId === barnISøknad.id)}
                            id={`${skjemafelt.id}${barnISøknad.id}`}
                            onChange={event => oppdaterListeMedBarn(event, barnISøknad.id)}
                        />
                    );
                })}
            </CheckboxGruppe>
            {children}
        </>
    ) : null;
};

export default HvilkeBarnCheckboxGruppe;
