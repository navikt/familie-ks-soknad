import type { LocaleRecordBlock, LocaleRecordString } from '@common/typer/locale';
import type { ISanitySpørsmålDokument } from '@typer/sanity/sanity';

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
