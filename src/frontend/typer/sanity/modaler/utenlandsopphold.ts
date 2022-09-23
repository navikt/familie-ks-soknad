import { LocaleRecordBlock } from '../../common';
import { ISanitySpørsmålDokument } from '../sanity';

export interface IUtenlandsoppholdTekstinnhold {
    flyttetFraNorgeDato: ISanitySpørsmålDokument;
    flyttetTilNorgeDato: ISanitySpørsmålDokument;
    landFlyttetFra: ISanitySpørsmålDokument;
    landFlyttetTil: ISanitySpørsmålDokument;
    periodeBeskrivelse: ISanitySpørsmålDokument;
    naavaerendeOpphold: ISanitySpørsmålDokument;
    sluttdatoFortid: ISanitySpørsmålDokument;
    sluttdatoFremtid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    tidligereOpphold: ISanitySpørsmålDokument;
    fjernKnapp: LocaleRecordBlock;
    flerePerioder: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
    tittel: LocaleRecordBlock;
    valgalternativOppholdUtenforNorgeNaa: LocaleRecordBlock;
    valgalternativOppholdUtenforNorgeTidligere: LocaleRecordBlock;
    valgalternativPermanentINorge: LocaleRecordBlock;
    valgalternativPermanentIUtland: LocaleRecordBlock;
    valgalternativPlaceholder: LocaleRecordBlock;
}
