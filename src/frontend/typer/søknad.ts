import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from './barn';
import { IDokumentasjon } from './dokumentasjon';
import { Dokumentasjonsbehov } from './kontrakt/dokumentasjon';
import { ESivilstand } from './kontrakt/generelle';
import { IBarn, ISøker } from './person';
import { ISøknadSpørsmål } from './spørsmål';
import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { EøsSøkerSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Søker/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { genererInitiellDokumentasjon } from '../utils/dokumentasjon';

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
    erBarnAdoptert: ISøknadSpørsmål<ESvar | null>;
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
    dokumentasjon: Object.keys(Dokumentasjonsbehov).map((dok: string) =>
        genererInitiellDokumentasjon(dok as Dokumentasjonsbehov)
    ),
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
        utenlandsoppholdUtenArbeid: {
            id: DinLivssituasjonSpørsmålId.utenlandsoppholdUtenArbeid,
            svar: null,
        },
        utenlandsperioder: [],
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
    erBarnAdoptert: {
        id: OmBarnaDineSpørsmålId.erBarnAdoptert,
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
