import { LocaleRecordBlock, LocaleRecordString } from '../../common';
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
    valgalternativOppholdUtenforNorgeNaa: LocaleRecordString;
    valgalternativOppholdUtenforNorgeTidligere: LocaleRecordString;
    valgalternativPermanentINorge: LocaleRecordString;
    valgalternativPermanentIUtland: LocaleRecordString;
    valgalternativPlaceholder: LocaleRecordString;
    oppsummeringstittel: LocaleRecordBlock;
    adresseFortid: ISanitySpørsmålDokument;
    adresseNaatid: ISanitySpørsmålDokument;
}
