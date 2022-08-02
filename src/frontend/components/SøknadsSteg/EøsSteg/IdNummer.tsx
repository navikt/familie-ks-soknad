import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { Alpha3Code, getName } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { guid } from 'nav-frontend-js-utils';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IEøsForBarnFeltTyper, IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
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
    feilmeldingSpråkId: string;
    spørsmålSpråkId: string;
    spørsmålCheckboxSpråkId: string;
    lesevisning?: boolean;
    barn?: IBarnMedISøknad;
}> = ({
    skjema,
    settIdNummerFelter,
    landAlphaCode,
    periodeType = undefined,
    idNummerVerdiFraSøknad,
    feilmeldingSpråkId,
    spørsmålSpråkId,
    spørsmålCheckboxSpråkId,
    barn,
    lesevisning = false,
}) => {
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
    const { formatMessage } = intl;

    // Bruker skal ha mulighet til å velge at hen ikke kjenner idnummer for: barn, andre forelder og søker (dersom idnummer for søker trigges av et utenlandsopphold).
    // Barn blir sendt med som prop når vi render Idnummer for andre forelder og barn, derfor kan vi sjekke på den propen.
    const skalViseVetIkkeCheckbox = !!barn || periodeType === PeriodeType.utenlandsperiode;

    const idNummerUkjent = useFelt<ESvar>({
        verdi:
            skalViseVetIkkeCheckbox && idNummerVerdiFraSøknad === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: `${guid()}idnummer-ukjent-${landAlphaCode}`,
        skalFeltetVises: () => skalViseVetIkkeCheckbox,
    });

    const idNummerFelt = useInputFeltMedUkjent({
        søknadsfelt: {
            id: `${guid()}${idNummerKeyPrefix}${landAlphaCode}`,
            svar:
                idNummerVerdiFraSøknad && idNummerVerdiFraSøknad !== AlternativtSvarForInput.UKJENT
                    ? idNummerVerdiFraSøknad
                    : '',
        },
        avhengighet: idNummerUkjent,
        feilmeldingSpråkId: feilmeldingSpråkId,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[0-9A-Za-z\s\-.\\/]{4,20}$/)) {
                return ok(felt);
            } else {
                return feil(felt, <SpråkTekst id={'felles.idnummer-feilformat.feilmelding'} />);
            }
        },
        ...(barn && { språkVerdier: { barn: barn.navn } }),
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
                    tittel={
                        <SpråkTekst
                            id={spørsmålSpråkId}
                            values={{
                                land: getName(landAlphaCode, valgtLocale),
                                ...(barn && { barn: barn.navn }),
                            }}
                        />
                    }
                    søknadsvar={
                        idNummerVerdiFraSøknad === AlternativtSvarForInput.UKJENT
                            ? formatMessage(
                                  {
                                      id: spørsmålCheckboxSpråkId,
                                  },
                                  { land: getName(landAlphaCode, valgtLocale) }
                              )
                            : idNummerVerdiFraSøknad
                    }
                />
            ) : (
                <>
                    <SkjemaFeltInput
                        felt={idNummerFelt}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={spørsmålSpråkId}
                        språkValues={{
                            land: getName(landAlphaCode, valgtLocale),
                            ...(barn && { barn: barn.navn }),
                        }}
                        disabled={idNummerUkjent.verdi === ESvar.JA}
                    />
                    {idNummerUkjent.erSynlig && (
                        <SkjemaCheckbox
                            labelSpråkTekstId={spørsmålCheckboxSpråkId}
                            felt={idNummerUkjent}
                            språkVerdier={{ land: getName(landAlphaCode, valgtLocale) }}
                        />
                    )}
                </>
            )}
        </IdNummerContainer>
    );
};
