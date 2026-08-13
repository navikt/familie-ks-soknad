import type { LocaleRecordBlock, LocaleRecordString } from '../../../../common/typer/locale';
import type { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';

import { EBarnehageplassPeriodeBeskrivelse } from './barnehageplassTyper';

export const hentBarnehageplassBeskrivelse = (
    beskrivelse: EBarnehageplassPeriodeBeskrivelse | '',
    tekster: IBarnehageplassTekstinnhold
): LocaleRecordString => {
    switch (beskrivelse) {
        case EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE:
            return tekster.valgalternativBarnehageplassTidligere;
        case EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN:
            return tekster.valgalternativBarnehageplassIFremtid;
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
        default:
            return tekster.sluttdatoFremtid.sporsmal;
    }
};
