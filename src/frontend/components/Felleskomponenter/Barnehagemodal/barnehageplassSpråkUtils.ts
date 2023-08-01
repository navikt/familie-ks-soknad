import { EBarnehageplassPeriodeBeskrivelse } from './barnehageplassTyper';
import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';

export const hentBarnehageplassBeskrivelse = (
    beskrivelse: EBarnehageplassPeriodeBeskrivelse | '',
    tekster: IBarnehageplassTekstinnhold
): LocaleRecordString => {
    switch (beskrivelse) {
        case EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE:
            return tekster.valgalternativBarnehageplassTidligere;
        case EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN:
            return tekster.valgalternativBarnehageplassIFremtid;
        case EBarnehageplassPeriodeBeskrivelse.HAR_BARNEHAGEPLASS_NÅ:
        default:
            return tekster.valgalternativBarnehageplassNaa;
    }
};

export const hentFraDatoSpørsmål = (
    beskrivelse: EBarnehageplassPeriodeBeskrivelse | '',
    tekster: IBarnehageplassTekstinnhold
): LocaleRecordBlock => {
    switch (beskrivelse) {
        case EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN:
            return tekster.startdatoFremtid.sporsmal;
        case EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE:
        case EBarnehageplassPeriodeBeskrivelse.HAR_BARNEHAGEPLASS_NÅ:
        default:
            return tekster.startdatoFortid.sporsmal;
    }
};

export const hentTilDatoSpørsmål = (
    beskrivelse: EBarnehageplassPeriodeBeskrivelse | '',
    tekster: IBarnehageplassTekstinnhold
): LocaleRecordBlock => {
    switch (beskrivelse) {
        case EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE:
            return tekster.sluttdatoFortid.sporsmal;
        case EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN:
        case EBarnehageplassPeriodeBeskrivelse.HAR_BARNEHAGEPLASS_NÅ:
        default:
            return tekster.sluttdatoFremtid.sporsmal;
    }
};
