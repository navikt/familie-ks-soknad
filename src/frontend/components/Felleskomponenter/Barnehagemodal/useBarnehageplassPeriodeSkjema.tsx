import React, { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { Typografi } from '../../../typer/common';
import { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IBarnehageplassPerioderFeltTyper } from '../../../typer/skjema';
import {
    dagenEtterDato,
    dagensDato,
    erSammeDatoSomDagensDato,
    gårsdagensDato,
    morgendagensDato,
} from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import TekstBlock from '../TekstBlock';
import { EBarnehageplassPeriodeBeskrivelse } from './barnehageplassTyper';
import { BarnehageplassPeriodeSpørsmålId } from './spørsmål';

export const useBarnehageplassPeriodeSkjema = () => {
    const { tekster } = useApp();
    const barnehageplassTekster: IBarnehageplassTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.barnehageplass;

    const barnehageplassPeriodeBeskrivelse = useFelt<EBarnehageplassPeriodeBeskrivelse | ''>({
        feltId: BarnehageplassPeriodeSpørsmålId.barnehageplassPeriodeBeskrivelse,
        verdi: '',
        valideringsfunksjon: (felt: FeltState<EBarnehageplassPeriodeBeskrivelse | ''>) =>
            felt.verdi !== ''
                ? ok(felt)
                : feil(
                      felt,
                      <TekstBlock
                          block={barnehageplassTekster.periodebeskrivelse.feilmelding}
                          typografi={Typografi.ErrorMessage}
                      />
                  ),
    });

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [barnehageplassPeriodeBeskrivelse.verdi]);

    const barnehageplassUtlandet = useJaNeiSpmFelt({
        søknadsfelt: { id: BarnehageplassPeriodeSpørsmålId.barnehageplassUtlandet, svar: null },
        feilmelding: barnehageplassTekster.utland.feilmelding,
        nullstillVedAvhengighetEndring: true,
        skalSkjules: !barnehageplassPeriodeBeskrivelse.verdi,
    });

    const barnehageplassLand = useLanddropdownFelt({
        søknadsfelt: { id: BarnehageplassPeriodeSpørsmålId.barnehageplassLand, svar: '' },
        feilmelding: barnehageplassTekster.hvilketLand.feilmelding,
        skalFeltetVises: barnehageplassUtlandet.verdi === ESvar.JA,
        nullstillVedAvhengighetEndring: true,
    });

    const offentligStøtte = useJaNeiSpmFelt({
        søknadsfelt: { id: BarnehageplassPeriodeSpørsmålId.offentligStøtte, svar: null },
        feilmelding: barnehageplassTekster.offentligStoette.feilmelding,
        skalSkjules: !(barnehageplassUtlandet.verdi === ESvar.JA),
        nullstillVedAvhengighetEndring: true,
    });

    const antallTimer = useFelt<string>({
        verdi: '',
        feltId: BarnehageplassPeriodeSpørsmålId.antallTimer,
        avhengigheter: { barnehageplassPeriodeBeskrivelse },
        skalFeltetVises: avhengigheter => !!avhengigheter.barnehageplassPeriodeBeskrivelse.verdi,
        valideringsfunksjon: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[\d\s.\\/,.]{1,7}$/)) {
                return ok(felt);
            } else {
                return feil(
                    felt,
                    <TekstBlock block={barnehageplassTekster.antallTimer.feilmelding} />
                    //TODO trenger feilmelding om feil format?
                );
            }
        },
    });

    const periodenErAvsluttet =
        barnehageplassPeriodeBeskrivelse.verdi ===
        EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE;

    const periodenHarIkkeStartet =
        barnehageplassPeriodeBeskrivelse.verdi ===
        EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN;

    const startetIBarnehagen = useDatovelgerFelt({
        søknadsfelt: { id: BarnehageplassPeriodeSpørsmålId.startetIBarnehagen, svar: '' },
        feilmelding: periodenHarIkkeStartet
            ? barnehageplassTekster.startdatoFremtid.feilmelding
            : barnehageplassTekster.startdatoFortid.feilmelding,
        skalFeltetVises: !!barnehageplassPeriodeBeskrivelse.verdi,
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
        feilmelding: periodenErAvsluttet
            ? barnehageplassTekster.sluttdatoFortid.feilmelding
            : barnehageplassTekster.sluttdatoFremtid.feilmelding,
        skalFeltetVises: !!barnehageplassPeriodeBeskrivelse.verdi,
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
