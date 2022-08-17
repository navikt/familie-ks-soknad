import React, { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IBarnehageplassPerioderFeltTyper } from '../../../typer/skjema';
import {
    dagenEtterDato,
    dagensDato,
    erSammeDatoSomDagensDato,
    gårsdagensDato,
    morgendagensDato,
} from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { EBarnehageplassPeriodeBeskrivelse } from './barnehageplassTyper';
import { BarnehageplassPeriodeSpørsmålId } from './spørsmål';

export const useBarnehageplassPeriodeSkjema = barn => {
    const barnehageplassPeriodeBeskrivelse = useFelt<EBarnehageplassPeriodeBeskrivelse | ''>({
        feltId: BarnehageplassPeriodeSpørsmålId.barnehageplassPeriodeBeskrivelse,
        verdi: '',
        valideringsfunksjon: (felt: FeltState<EBarnehageplassPeriodeBeskrivelse | ''>) =>
            felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'todo.ombarnet.barnehageplass.periode'} />),
    });

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [barnehageplassPeriodeBeskrivelse.verdi]);

    const barnehageplassUtlandet = useJaNeiSpmFelt({
        søknadsfelt: { id: BarnehageplassPeriodeSpørsmålId.barnehageplassUtlandet, svar: null },
        feilmeldingSpråkId: 'todo.ombarnet.barnehageplass.periode',
        feilmeldingSpråkVerdier: { barn: barn.navn },
    });

    const barnehageplassLand = useLanddropdownFelt({
        søknadsfelt: { id: BarnehageplassPeriodeSpørsmålId.barnehageplassLand, svar: '' },
        feilmeldingSpråkId: 'todo.ombarnet.barnehageplass.periode',
        skalFeltetVises: barnehageplassUtlandet.verdi === ESvar.JA,
        nullstillVedAvhengighetEndring: true,
        feilmeldingSpråkVerdier: { barn: barn.navn },
    });

    const offentligStøtte = useJaNeiSpmFelt({
        søknadsfelt: { id: BarnehageplassPeriodeSpørsmålId.offentligStøtte, svar: null },
        feilmeldingSpråkId: 'todo.ombarnet.barnehageplass.periode',
        skalSkjules: barnehageplassUtlandet.verdi === ESvar.NEI,
    });

    const antallTimer = useFelt<string>({
        verdi: '',
        feltId: BarnehageplassPeriodeSpørsmålId.antallTimer,
        valideringsfunksjon: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[\d\s.\\/,.]{1,7}$/)) {
                return ok(felt);
            } else {
                return feil(
                    felt,
                    <SpråkTekst
                        id={
                            verdi === ''
                                ? 'todo.ombarnet.barnehageplass.periode'
                                : 'todo.ombarnet.barnehageplass.periode'
                        }
                    />
                );
            }
        },
    });

    const startetIBarnehagen = useDatovelgerFelt({
        søknadsfelt: { id: BarnehageplassPeriodeSpørsmålId.startetIBarnehagen, svar: '' },
        feilmeldingSpråkId: 'todo.ombarnet.barnehageplass.periode',
        skalFeltetVises: true,
        startdatoAvgrensning:
            barnehageplassPeriodeBeskrivelse.verdi ===
            EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN
                ? dagensDato()
                : undefined,
        sluttdatoAvgrensning:
            barnehageplassPeriodeBeskrivelse.verdi ===
            EBarnehageplassPeriodeBeskrivelse.HAR_BARNEHAGEPLASS_NÅ
                ? dagensDato()
                : barnehageplassPeriodeBeskrivelse.verdi ===
                  EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE
                ? gårsdagensDato()
                : undefined,
        nullstillVedAvhengighetEndring: true,
    });

    const slutterIBarnehagenVetIkke = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: BarnehageplassPeriodeSpørsmålId.slutterIBarnehagenVetIkke,
        skalFeltetVises: avhengigheter =>
            avhengigheter?.barnehageplassPeriodeBeskrivelse?.verdi ===
            EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE,
        avhengigheter: { barnehageplassPeriodeBeskrivelse },
    });

    const slutterIBarnehagen = useDatovelgerFeltMedUkjent({
        feltId: BarnehageplassPeriodeSpørsmålId.slutterIBarnehagen,
        initiellVerdi: '',
        vetIkkeCheckbox: slutterIBarnehagenVetIkke,
        feilmeldingSpråkId: 'todo.ombarnet.barnehageplass.periode',
        skalFeltetVises: true,
        startdatoAvgrensning:
            barnehageplassPeriodeBeskrivelse.verdi ===
            EBarnehageplassPeriodeBeskrivelse.HAR_BARNEHAGEPLASS_NÅ
                ? morgendagensDato()
                : dagenEtterDato(startetIBarnehagen.verdi),
        sluttdatoAvgrensning:
            barnehageplassPeriodeBeskrivelse.verdi ===
            EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE
                ? dagensDato()
                : undefined,
        customStartdatoFeilmelding: erSammeDatoSomDagensDato(startetIBarnehagen.verdi)
            ? undefined
            : 'todo.ombarnet.barnehageplass.periode',
    });

    const skjema = useSkjema<IBarnehageplassPerioderFeltTyper, 'string'>({
        felter: {
            barnehageplassPeriodeBeskrivelse,
            barnehageplassUtlandet,
            barnehageplassLand,
            offentligStøtte,
            antallTimer,
            startetIBarnehagen,
            slutterIBarnehagen,
            slutterIBarnehagenVetIkke,
        },

        skjemanavn: 'barnehageplassPerioder',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
