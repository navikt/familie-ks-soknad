import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { IEøsForBarnFeltTyper, IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { OppsummeringFelt } from '../Oppsummering/OppsummeringFelt';

import { idNummerKeyPrefix, PeriodeType } from './idnummerUtils';

export const IdNummerContainer = styled.div<{ lesevisning: boolean }>`
    margin-bottom: ${props => (props.lesevisning ? '1rem' : '2rem')};
`;

export const IdNummer: React.FC<{
    skjema: ISkjema<IEøsForSøkerFeltTyper | IEøsForBarnFeltTyper, string>;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    landAlphaCode: Alpha3Code | '';
    periodeType?: PeriodeType;
    idNummerVerdiFraSøknad: string | undefined;
    lesevisning?: boolean;
    spørsmålDokument: ISanitySpørsmålDokument;
    barn?: IBarnMedISøknad;
}> = ({
    skjema,
    settIdNummerFelter,
    landAlphaCode,
    periodeType = undefined,
    idNummerVerdiFraSøknad,
    barn,
    spørsmålDokument,
    lesevisning = false,
}) => {
    const { plainTekst, tekster } = useApp();

    // Bruker skal ha mulighet til å velge at hen ikke kjenner idnummer for: barn, andre forelder og søker (dersom idnummer for søker trigges av et utenlandsopphold).
    // Barn blir sendt med som prop når vi render Idnummer for andre forelder og barn, derfor kan vi sjekke på den propen.
    const skalViseVetIkkeCheckbox = !!barn || periodeType === PeriodeType.utenlandsperiode;

    const idNummerUkjent = useFelt<ESvar>({
        verdi:
            skalViseVetIkkeCheckbox && idNummerVerdiFraSøknad === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: `${uuidv4()}idnummer-ukjent-${landAlphaCode}`,
        skalFeltetVises: () => skalViseVetIkkeCheckbox,
    });

    const idNummerFelt = useInputFeltMedUkjent({
        søknadsfelt: {
            id: `${uuidv4()}${idNummerKeyPrefix}${landAlphaCode}`,
            svar:
                idNummerVerdiFraSøknad && idNummerVerdiFraSøknad !== AlternativtSvarForInput.UKJENT
                    ? idNummerVerdiFraSøknad
                    : '',
        },
        avhengighet: idNummerUkjent,
        feilmelding: spørsmålDokument.feilmelding,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[\dA-Za-z\s\-.\\/]{4,20}$/)) {
                return ok(felt);
            } else {
                return feil(
                    felt,
                    plainTekst(tekster().FELLES.formateringsfeilmeldinger.ugyldigIDnummer)
                );
            }
        },
        flettefelter: { barnetsNavn: barn?.navn, land: landAlphaCode },
    });

    useEffect(() => {
        settIdNummerFelter((prev: Felt<string>[]) =>
            prev.filter(felt => felt.id !== idNummerFelt.id).concat(idNummerFelt)
        );
    }, [idNummerFelt.verdi, idNummerFelt.valideringsstatus]);

    return (
        <IdNummerContainer lesevisning={lesevisning}>
            {lesevisning ? (
                <OppsummeringFelt
                    spørsmålstekst={spørsmålDokument.sporsmal}
                    søknadsvar={
                        idNummerVerdiFraSøknad === AlternativtSvarForInput.UKJENT
                            ? plainTekst(spørsmålDokument.checkboxLabel, {
                                  land: landAlphaCode,
                              })
                            : idNummerVerdiFraSøknad
                    }
                    flettefelter={{ land: landAlphaCode, barnetsNavn: barn?.navn }}
                />
            ) : (
                <>
                    <SkjemaFeltInput
                        felt={idNummerFelt}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={
                            <TekstBlock
                                block={spørsmålDokument.sporsmal}
                                flettefelter={{
                                    land: landAlphaCode,
                                    barnetsNavn: barn?.navn,
                                }}
                            />
                        }
                        disabled={idNummerUkjent.verdi === ESvar.JA}
                    />
                    {idNummerUkjent.erSynlig && (
                        <SkjemaCheckbox
                            label={plainTekst(spørsmålDokument.checkboxLabel, {
                                land: landAlphaCode,
                            })}
                            felt={idNummerUkjent}
                        />
                    )}
                </>
            )}
        </IdNummerContainer>
    );
};
