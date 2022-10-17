import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnaDineFeltTyper } from '../../../typer/skjema';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { IOmBarnaTekstinnhold } from './innholdTyper';
import { OmBarnaDineSpørsmålId } from './spørsmål';
import useBarnCheckboxFelt from './useBarnCheckboxFelt';
import { genererOppdaterteBarn } from './utils';

export const useOmBarnaDine = (): {
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad } = useApp();
    const { skalTriggeEøsForBarn, barnSomTriggerEøs, settBarnSomTriggerEøs, erEøsLand } = useEøs();
    const { tekster } = useApp();
    const omBarnaTekster: IOmBarnaTekstinnhold = tekster()[ESanitySteg.OM_BARNA];

    const erNoenAvBarnaFosterbarn = useJaNeiSpmFelt({
        søknadsfelt: søknad.erNoenAvBarnaFosterbarn,
        feilmeldingSpråkId: 'ombarna.fosterbarn.feilmelding',
    });

    const hvemErFosterbarn = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erFosterbarn,
        'ombarna.fosterbarn.hvem.feilmelding',
        erNoenAvBarnaFosterbarn
    );

    const oppholderBarnSegIInstitusjon = useJaNeiSpmFelt({
        søknadsfelt: søknad.oppholderBarnSegIInstitusjon,
        feilmeldingSpråkId: 'ombarna.institusjon.feilmelding',
    });

    const hvemOppholderSegIInstitusjon = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIInstitusjon,
        'ombarna.institusjon.hvem.feilmelding',
        oppholderBarnSegIInstitusjon
    );

    const erBarnAdoptertFraUtland = useJaNeiSpmFelt({
        søknadsfelt: søknad.erBarnAdoptertFraUtland,
        feilmeldingSpråkId: 'ombarna.adoptert.feilmelding',
    });

    const hvemErAdoptertFraUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAdoptertFraUtland,
        'ombarna.adoptert.hvem.feilmelding',
        erBarnAdoptertFraUtland
    );

    const søktAsylForBarn = useJaNeiSpmFelt({
        søknadsfelt: søknad.søktAsylForBarn,
        feilmeldingSpråkId: 'ombarna.asyl.feilmelding',
    });

    const hvemErSøktAsylFor = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAsylsøker,
        'ombarna.asyl.hvem.feilmelding',
        søktAsylForBarn
    );

    const barnOppholdtSegTolvMndSammenhengendeINorge = useJaNeiSpmFelt({
        søknadsfelt: søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
        feilmeldingSpråkId: 'ombarna.sammenhengende-opphold.feilmelding',
    });

    const hvemTolvMndSammenhengendeINorge = useBarnCheckboxFelt(
        barnDataKeySpørsmål.boddMindreEnn12MndINorge,
        'ombarna.sammenhengende-opphold.hvem.feilmelding',
        barnOppholdtSegTolvMndSammenhengendeINorge,
        ESvar.NEI
    );

    const mottarKontantstøtteForBarnFraAnnetEøsland = useJaNeiSpmFelt({
        søknadsfelt: søknad.mottarKontantstøtteForBarnFraAnnetEøsland,
        feilmeldingSpråkId: 'ombarna.barnetrygd-eøs-fortid.feilmelding',
    });

    const hvemKontantstøtteFraAnnetEøsland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland,
        'ombarna.barnetrygd-eøs-fortid.hvem.feilmelding',
        mottarKontantstøtteForBarnFraAnnetEøsland
    );

    const harEllerTildeltBarnehageplass = useJaNeiSpmFelt({
        søknadsfelt: søknad.harEllerTildeltBarnehageplass,
        feilmelding: omBarnaTekster.barnehageplass.feilmelding,
    });

    const hvemHarBarnehageplass = useBarnCheckboxFelt(
        barnDataKeySpørsmål.harBarnehageplass,
        'todo.ombarnadine.barnehageplass',
        harEllerTildeltBarnehageplass
    );

    const avdødPartnerForelderFeilmelding = () => {
        switch (søknad.erAvdødPartnerForelder.id) {
            case OmBarnaDineSpørsmålId.erOppgittAvdødPartnerForelder:
                return 'ombarna.enkeenkemann.feilmelding';
            case OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder:
                return 'ombarna.enkeenkemann.folkeregisteret-gjenlevende.feilmelding';
            default:
                return 'ombarna.enkeenkemann.folkeregisteret-enke.feilmelding';
        }
    };

    const erAvdødPartnerForelder = useJaNeiSpmFelt({
        søknadsfelt: søknad.erAvdødPartnerForelder,
        feilmeldingSpråkId: avdødPartnerForelderFeilmelding(),
        skalSkjules: !(
            søknad.søker.sivilstand.type === ESivilstand.ENKE_ELLER_ENKEMANN ||
            søknad.søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER
        ),
    });

    const hvemAvdødPartner = useBarnCheckboxFelt(
        barnDataKeySpørsmål.andreForelderErDød,
        'ombarna.enkeenkemann.hvem.feilmelding',
        erAvdødPartnerForelder
    );

    useEffect(() => {
        const oppdaterteBarn = genererOppdaterteBarn(
            søknad,
            skjema,
            skalTriggeEøsForBarn,
            erEøsLand
        );

        oppdaterteBarn.forEach(oppdatertBarn => {
            const skalTriggeEøs = skalTriggeEøsForBarn(oppdatertBarn);
            if (
                (skalTriggeEøs && !barnSomTriggerEøs.includes(oppdatertBarn.id)) ||
                (!skalTriggeEøs && barnSomTriggerEøs.includes(oppdatertBarn.id))
            ) {
                settBarnSomTriggerEøs(prevState => {
                    if (skalTriggeEøs) {
                        return prevState.concat(oppdatertBarn.id);
                    } else {
                        return prevState.filter(
                            barnSomTriggetEøsId => barnSomTriggetEøsId !== oppdatertBarn.id
                        );
                    }
                });
            }
        });
    }, [hvemKontantstøtteFraAnnetEøsland]);

    const oppdaterSøknad = () => {
        const oppdaterteBarn = genererOppdaterteBarn(
            søknad,
            skjema,
            skalTriggeEøsForBarn,
            erEøsLand
        );

        const skalNullstilleEøsForSøker =
            !søknad.søker.triggetEøs && !oppdaterteBarn.find(barn => barn.triggetEøs);

        settSøknad({
            ...søknad,
            søker: skalNullstilleEøsForSøker
                ? { ...søknad.søker, ...nullstilteEøsFelterForSøker(søknad.søker) }
                : søknad.søker,
            erNoenAvBarnaFosterbarn: {
                ...søknad.erNoenAvBarnaFosterbarn,
                svar: erNoenAvBarnaFosterbarn.verdi,
            },
            oppholderBarnSegIInstitusjon: {
                ...søknad.oppholderBarnSegIInstitusjon,
                svar: oppholderBarnSegIInstitusjon.verdi,
            },
            erBarnAdoptertFraUtland: {
                ...søknad.erBarnAdoptertFraUtland,
                svar: erBarnAdoptertFraUtland.verdi,
            },
            søktAsylForBarn: {
                ...søknad.søktAsylForBarn,
                svar: søktAsylForBarn.verdi,
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                ...søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
                svar: barnOppholdtSegTolvMndSammenhengendeINorge.verdi,
            },
            mottarKontantstøtteForBarnFraAnnetEøsland: {
                ...søknad.mottarKontantstøtteForBarnFraAnnetEøsland,
                svar: mottarKontantstøtteForBarnFraAnnetEøsland.verdi,
            },
            harEllerTildeltBarnehageplass: {
                ...søknad.harEllerTildeltBarnehageplass,
                svar: harEllerTildeltBarnehageplass.verdi,
            },
            erAvdødPartnerForelder: {
                ...søknad.erAvdødPartnerForelder,
                svar: erAvdødPartnerForelder.verdi,
            },
            barnInkludertISøknaden: oppdaterteBarn,
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                switch (dok.dokumentasjonsbehov) {
                    case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
                        return {
                            ...dok,
                            gjelderForBarnId: hvemErSøktAsylFor.verdi,
                        };
                    case Dokumentasjonsbehov.ADOPSJON_DATO:
                        return {
                            ...dok,
                            gjelderForBarnId: hvemErAdoptertFraUtland.verdi,
                        };
                    case Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN:
                        return {
                            ...dok,
                            gjelderForBarnId: hvemErFosterbarn.verdi,
                        };
                    case Dokumentasjonsbehov.BEKREFTELESE_PÅ_BARNEHAGEPLASS:
                        return {
                            ...dok,
                            gjelderForBarnId: hvemHarBarnehageplass.verdi,
                        };
                    default:
                        return dok;
                }
            }),
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmBarnaDineFeltTyper,
        string
    >({
        felter: {
            erNoenAvBarnaFosterbarn,
            oppholderBarnSegIInstitusjon,
            erBarnAdoptertFraUtland,
            søktAsylForBarn,
            barnOppholdtSegTolvMndSammenhengendeINorge,
            mottarKontantstøtteForBarnFraAnnetEøsland,
            harEllerTildeltBarnehageplass,
            erAvdødPartnerForelder,
            hvemErFosterbarn,
            hvemErAdoptertFraUtland,
            hvemOppholderSegIInstitusjon,
            hvemKontantstøtteFraAnnetEøsland,
            hvemTolvMndSammenhengendeINorge,
            hvemErSøktAsylFor,
            hvemHarBarnehageplass,
            hvemAvdødPartner,
        },
        skjemanavn: 'ombarnadine',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        oppdaterSøknad,
        validerAlleSynligeFelter,
    };
};
