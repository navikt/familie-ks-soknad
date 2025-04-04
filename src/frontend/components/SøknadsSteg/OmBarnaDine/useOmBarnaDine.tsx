import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { type ISkjema, useSkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnaDineFeltTyper } from '../../../typer/skjema';
import { ISøknad } from '../../../typer/søknad';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';

import { IOmBarnaTekstinnhold } from './innholdTyper';
import { OmBarnaDineSpørsmålId } from './spørsmål';
import useBarnCheckboxFelt from './useBarnCheckboxFelt';
import { genererOppdaterteBarn } from './utils';

export const useOmBarnaDine = (): {
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => ISøknad;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad, tekster, plainTekst } = useAppContext();
    const { skalTriggeEøsForBarn, barnSomTriggerEøs, settBarnSomTriggerEøs, erEøsLand } =
        useEøsContext();

    const teksterForSteg: IOmBarnaTekstinnhold = tekster()[ESanitySteg.OM_BARNA];

    const erNoenAvBarnaFosterbarn = useJaNeiSpmFelt({
        søknadsfelt: søknad.erNoenAvBarnaFosterbarn,
        feilmelding: teksterForSteg.fosterbarn.feilmelding,
    });

    const hvemErFosterbarn = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erFosterbarn,
        plainTekst(teksterForSteg.hvemFosterbarn.feilmelding),
        erNoenAvBarnaFosterbarn
    );

    const oppholderBarnSegIInstitusjon = useJaNeiSpmFelt({
        søknadsfelt: søknad.oppholderBarnSegIInstitusjon,
        feilmelding: teksterForSteg.institusjonKontantstoette.feilmelding,
    });

    const hvemOppholderSegIInstitusjon = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIInstitusjon,
        plainTekst(teksterForSteg.hvemInstitusjon.feilmelding),
        oppholderBarnSegIInstitusjon
    );

    const erBarnAdoptert = useJaNeiSpmFelt({
        søknadsfelt: søknad.erBarnAdoptert,
        feilmelding: teksterForSteg.adoptertKontantstoette.feilmelding,
    });

    const hvemErAdoptert = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAdoptert,
        plainTekst(teksterForSteg.hvemAdoptertKontantstoette.feilmelding),
        erBarnAdoptert
    );

    const søktAsylForBarn = useJaNeiSpmFelt({
        søknadsfelt: søknad.søktAsylForBarn,
        feilmelding: teksterForSteg.asyl.feilmelding,
    });

    const hvemErSøktAsylFor = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAsylsøker,
        plainTekst(teksterForSteg.hvemAsyl.feilmelding),
        søktAsylForBarn
    );

    const barnOppholdtSegTolvMndSammenhengendeINorge = useJaNeiSpmFelt({
        søknadsfelt: søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
        feilmelding: teksterForSteg.sammenhengendeOppholdINorge.feilmelding,
    });

    const hvemTolvMndSammenhengendeINorge = useBarnCheckboxFelt(
        barnDataKeySpørsmål.boddMindreEnn12MndINorge,
        plainTekst(teksterForSteg.hvemOppholdUtenforNorge.feilmelding),
        barnOppholdtSegTolvMndSammenhengendeINorge,
        ESvar.NEI
    );

    const mottarKontantstøtteForBarnFraAnnetEøsland = useJaNeiSpmFelt({
        søknadsfelt: søknad.mottarKontantstøtteForBarnFraAnnetEøsland,
        feilmelding: teksterForSteg.soektYtelseEuEoes.feilmelding,
    });

    const hvemKontantstøtteFraAnnetEøsland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland,
        plainTekst(teksterForSteg.hvemSoektYtelse.feilmelding),
        mottarKontantstøtteForBarnFraAnnetEøsland
    );

    const harEllerTildeltBarnehageplass = useJaNeiSpmFelt({
        søknadsfelt: søknad.harEllerTildeltBarnehageplass,
        feilmelding: teksterForSteg.barnehageplass.feilmelding,
    });

    const hvemHarBarnehageplass = useBarnCheckboxFelt(
        barnDataKeySpørsmål.harBarnehageplass,
        plainTekst(teksterForSteg.hvemBarnehageplass.feilmelding),
        harEllerTildeltBarnehageplass
    );

    const erAvdødPartnerForelder = useJaNeiSpmFelt({
        søknadsfelt: søknad.erAvdødPartnerForelder,
        feilmelding:
            søknad.erAvdødPartnerForelder.id ===
            OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                ? teksterForSteg.folkeregistrertGjenlevende.feilmelding
                : teksterForSteg.folkeregistrertEnkeEnkemann.feilmelding,
        skalSkjules: !(
            søknad.søker.sivilstand.type === ESivilstand.ENKE_ELLER_ENKEMANN ||
            søknad.søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER
        ),
    });

    const hvemAvdødPartner = useBarnCheckboxFelt(
        barnDataKeySpørsmål.andreForelderErDød,
        plainTekst(
            søknad.erAvdødPartnerForelder.id ===
                OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                ? teksterForSteg.hvemAvBarnaAvdoedPartner.feilmelding
                : teksterForSteg.hvemAvBarnaAvdoedEktefelle.feilmelding
        ),
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

        const oppdatertSøknad = {
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
            erBarnAdoptert: {
                ...søknad.erBarnAdoptert,
                svar: erBarnAdoptert.verdi,
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
                            gjelderForBarnId: hvemErAdoptert.verdi,
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
        };

        settSøknad(oppdatertSøknad);
        return oppdatertSøknad;
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmBarnaDineFeltTyper,
        string
    >({
        felter: {
            erNoenAvBarnaFosterbarn,
            oppholderBarnSegIInstitusjon,
            erBarnAdoptert,
            søktAsylForBarn,
            barnOppholdtSegTolvMndSammenhengendeINorge,
            mottarKontantstøtteForBarnFraAnnetEøsland,
            harEllerTildeltBarnehageplass,
            erAvdødPartnerForelder,
            hvemErFosterbarn,
            hvemErAdoptert,
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
