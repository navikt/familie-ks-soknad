import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, type FeltState, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IUsePeriodeSkjemaVerdi } from '../../../typer/perioder';
import { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IFormateringsfeilmeldingerTekstinnhold } from '../../../typer/sanity/tekstInnhold';
import { IBarnehageplassPerioderFeltTyper } from '../../../typer/skjema';
import {
    dagenEtterDato,
    dagensDato,
    erSammeDatoSomDagensDato,
    gårsdagensDato,
    morgendagensDato,
    stringTilDate,
} from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';

import { EBarnehageplassPeriodeBeskrivelse } from './barnehageplassTyper';
import { BarnehageplassPeriodeSpørsmålId } from './spørsmål';

interface UseBarnehageplassSkjemaVerdi
    extends IUsePeriodeSkjemaVerdi<IBarnehageplassPerioderFeltTyper> {
    slutterIBarnehagenMinDato: () => Date | undefined;
}

export const useBarnehageplassPeriodeSkjema = (): UseBarnehageplassSkjemaVerdi => {
    const { tekster, plainTekst } = useAppContext();
    const barnehageplassTekster: IBarnehageplassTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.barnehageplass;
    const formateringsfeilmeldinger: IFormateringsfeilmeldingerTekstinnhold =
        tekster()[ESanitySteg.FELLES].formateringsfeilmeldinger;

    const barnehageplassPeriodeBeskrivelse = useFelt<EBarnehageplassPeriodeBeskrivelse | ''>({
        feltId: BarnehageplassPeriodeSpørsmålId.barnehageplassPeriodeBeskrivelse,
        verdi: '',
        valideringsfunksjon: (felt: FeltState<EBarnehageplassPeriodeBeskrivelse | ''>) =>
            felt.verdi !== ''
                ? ok(felt)
                : feil(felt, plainTekst(barnehageplassTekster.periodebeskrivelse.feilmelding)),
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

    const antallTimer = useInputFelt({
        søknadsfelt: { id: BarnehageplassPeriodeSpørsmålId.antallTimer, svar: '' },
        feilmelding: barnehageplassTekster.antallTimer.feilmelding,
        skalVises: !!barnehageplassPeriodeBeskrivelse.verdi,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[\d\s.\\/,]{1,7}$/)) {
                return ok(felt);
            } else {
                return feil(felt, plainTekst(barnehageplassTekster.ugyldigTimer));
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
        customStartdatoFeilmelding: plainTekst(
            formateringsfeilmeldinger.datoKanIkkeVaereTilbakeITid
        ),
    });

    const slutterIBarnehagenVetIkke = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: BarnehageplassPeriodeSpørsmålId.slutterIBarnehagenVetIkke,
        skalFeltetVises: avhengigheter =>
            avhengigheter?.barnehageplassPeriodeBeskrivelse.verdi !==
            EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE,
        avhengigheter: { barnehageplassPeriodeBeskrivelse },
    });

    const slutterIBarnehagenMinDato = () => {
        const startetIBarnehageDato =
            startetIBarnehagen.verdi && stringTilDate(startetIBarnehagen.verdi);

        switch (barnehageplassPeriodeBeskrivelse.verdi) {
            case EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE:
                return startetIBarnehageDato ? dagenEtterDato(startetIBarnehageDato) : undefined;
            case EBarnehageplassPeriodeBeskrivelse.HAR_BARNEHAGEPLASS_NÅ:
                return morgendagensDato();
            case EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN:
                return startetIBarnehageDato
                    ? dagenEtterDato(startetIBarnehageDato)
                    : morgendagensDato();
        }
    };

    const slutterIBarnehagen = useDatovelgerFeltMedUkjent({
        feltId: BarnehageplassPeriodeSpørsmålId.slutterIBarnehagen,
        initiellVerdi: '',
        vetIkkeCheckbox: slutterIBarnehagenVetIkke,
        feilmelding: periodenErAvsluttet
            ? barnehageplassTekster.sluttdatoFortid.feilmelding
            : barnehageplassTekster.sluttdatoFremtid.feilmelding,
        skalFeltetVises: !!barnehageplassPeriodeBeskrivelse.verdi,
        sluttdatoAvgrensning: periodenErAvsluttet ? dagensDato() : undefined,
        startdatoAvgrensning: slutterIBarnehagenMinDato(),
        customStartdatoFeilmelding: erSammeDatoSomDagensDato(
            stringTilDate(startetIBarnehagen.verdi)
        )
            ? undefined
            : plainTekst(formateringsfeilmeldinger.periodeAvsluttesForTidlig),
        avhengigheter: { startetIBarnehagen },
        nullstillVedAvhengighetEndring: false,
    });

    const skjema = useSkjema<IBarnehageplassPerioderFeltTyper, string>({
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
        slutterIBarnehagenMinDato,
    };
};
