import { EBarnehageplassPeriodeBeskrivelse } from './barnehageplassTyper';

export const beskrivelseSpråkId = (beskrivelse: EBarnehageplassPeriodeBeskrivelse | ''): string => {
    switch (beskrivelse) {
        case EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE:
            return 'todo.ombarnet.barnehageplass.periode.tidligere';
        case EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN:
            return 'todo.ombarnet.barnehageplass.periode.fremtiden';
        default:
            return 'todo.ombarnet.barnehageplass.periode.nå';
    }
};
