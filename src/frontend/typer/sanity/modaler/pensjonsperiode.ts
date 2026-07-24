import { ISanitySpørsmålDokument } from '../sanity';
import { LocaleRecordBlock, LocaleRecordString } from '../../../../common/typer/locale';

export interface IPensjonsperiodeTekstinnhold {
    tittel: LocaleRecordBlock;
    pensjonLandNaatid: ISanitySpørsmålDokument;
    pensjonLandFortid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    sluttdato: ISanitySpørsmålDokument;
    faarPensjonNaa: ISanitySpørsmålDokument;
    leggTilFeilmelding: LocaleRecordBlock;
    oppsummeringstittel: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
}
