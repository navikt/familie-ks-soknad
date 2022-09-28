import { ESvar } from '@navikt/familie-form-elements';

import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { EøsSøkerSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Søker/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { genererInitiellDokumentasjon } from '../utils/dokumentasjon';
import { IBarnMedISøknad } from './barn';
import { dokumentasjonsbehovTilSpråkId, IDokumentasjon } from './dokumentasjon';
import { Dokumentasjonsbehov } from './kontrakt/dokumentasjon';
import { ESivilstand } from './kontrakt/generelle';
import { IBarn, ISøker } from './person';
import { ISøknadSpørsmål } from './spørsmål';

export const søknadstype = {
    id: 340008,
    navn: 'Kontantstøtte',
};

export interface ISøknad {
    erEøs: boolean;
    søker: ISøker;
    lestOgForståttBekreftelse: boolean;
    barnInkludertISøknaden: IBarnMedISøknad[];
    barnRegistrertManuelt: IBarn[];
    erNoenAvBarnaFosterbarn: ISøknadSpørsmål<ESvar | null>;
    oppholderBarnSegIInstitusjon: ISøknadSpørsmål<ESvar | null>;
    erBarnAdoptertFraUtland: ISøknadSpørsmål<ESvar | null>;
    søktAsylForBarn: ISøknadSpørsmål<ESvar | null>;
    erAvdødPartnerForelder: ISøknadSpørsmål<ESvar | null>;
    barnOppholdtSegTolvMndSammenhengendeINorge: ISøknadSpørsmål<ESvar | null>;
    mottarKontantstøtteForBarnFraAnnetEøsland: ISøknadSpørsmål<ESvar | null>;
    harEllerTildeltBarnehageplass: ISøknadSpørsmål<ESvar | null>;
    dokumentasjon: IDokumentasjon[];
}

export const initialStateSøknad: ISøknad = {
    erEøs: false,
    barnInkludertISøknaden: [],
    lestOgForståttBekreftelse: false,
    barnRegistrertManuelt: [],
    dokumentasjon: [
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.AVTALE_DELT_BOSTED,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.AVTALE_DELT_BOSTED),
            'dokumentasjon.deltbosted.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE),
            'dokumentasjon.oppholdstillatelse.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.ADOPSJON_DATO,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.ADOPSJON_DATO),
            'dokumentasjon.adopsjon.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN),
            'dokumentasjon.bekreftelsebarnevernet.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.BOR_FAST_MED_SØKER,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.BOR_FAST_MED_SØKER),
            'dokumentasjon.bekreftelseborsammen.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.BEKREFTELESE_PÅ_BARNEHAGEPLASS,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.BEKREFTELESE_PÅ_BARNEHAGEPLASS),
            null
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.ANNEN_DOKUMENTASJON,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.ANNEN_DOKUMENTASJON),
            null
        ),
    ],
    søker: {
        navn: '',
        barn: [],
        triggetEøs: false,
        statsborgerskap: [],
        ident: '',
        sivilstand: { type: ESivilstand.UOPPGITT },
        adressebeskyttelse: false,
        adresse: {
            adressenavn: '',
            husbokstav: '',
            husnummer: '',
            bruksenhetsnummer: '',
            postnummer: '',
            poststed: '',
        },
        utenlandsperioder: [],
        borPåRegistrertAdresse: {
            id: OmDegSpørsmålId.borPåRegistrertAdresse,
            svar: null,
        },
        værtINorgeITolvMåneder: {
            id: OmDegSpørsmålId.værtINorgeITolvMåneder,
            svar: null,
        },
        planleggerÅBoINorgeTolvMnd: {
            id: OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd,
            svar: null,
        },
        yrkesaktivFemÅr: {
            id: OmDegSpørsmålId.yrkesaktivFemÅr,
            svar: null,
        },
        erAsylsøker: {
            id: DinLivssituasjonSpørsmålId.erAsylsøker,
            svar: null,
        },
        arbeidIUtlandet: {
            id: DinLivssituasjonSpørsmålId.arbeidIUtlandet,
            svar: null,
        },
        mottarUtenlandspensjon: {
            id: DinLivssituasjonSpørsmålId.mottarUtenlandspensjon,
            svar: null,
        },
        arbeidsperioderUtland: [],

        arbeidINorge: {
            id: EøsSøkerSpørsmålId.arbeidINorge,
            svar: null,
        },
        arbeidsperioderNorge: [],
        pensjonNorge: {
            id: EøsSøkerSpørsmålId.pensjonNorge,
            svar: null,
        },
        pensjonsperioderNorge: [],
        pensjonsperioderUtland: [],
        andreUtbetalinger: {
            id: EøsSøkerSpørsmålId.utbetalinger,
            svar: null,
        },
        andreUtbetalingsperioder: [],
        adresseISøkeperiode: { id: EøsSøkerSpørsmålId.adresseISøkeperiode, svar: '' },
        idNummer: [],
    },
    erNoenAvBarnaFosterbarn: {
        id: OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
        svar: null,
    },
    oppholderBarnSegIInstitusjon: {
        id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
        svar: null,
    },
    erBarnAdoptertFraUtland: {
        id: OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland,
        svar: null,
    },
    søktAsylForBarn: {
        id: OmBarnaDineSpørsmålId.søktAsylForBarn,
        svar: null,
    },
    barnOppholdtSegTolvMndSammenhengendeINorge: {
        id: OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge,
        svar: null,
    },
    mottarKontantstøtteForBarnFraAnnetEøsland: {
        id: OmBarnaDineSpørsmålId.mottarKontantstøtteForBarnFraAnnetEøsland,
        svar: null,
    },
    harEllerTildeltBarnehageplass: {
        id: OmBarnaDineSpørsmålId.harEllerTildeltBarnehageplass,
        svar: null,
    },
    erAvdødPartnerForelder: {
        id: OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder,
        svar: null,
    },
};
