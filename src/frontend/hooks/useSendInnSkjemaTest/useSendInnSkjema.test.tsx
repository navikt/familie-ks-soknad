import { ESivilstand } from '../../typer/kontrakt/generelle';
import { IFrittståendeOrdTekstinnhold } from '../../typer/sanity/tekstInnhold';
import { hentSivilstatusSpråkId } from '../../utils/språk';
import { silenceConsoleErrors } from '../../utils/testing';

silenceConsoleErrors();

describe('useSendInnSkjema', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    const toLocaleRecordString = (ord: string) => ({
        en: ord,
        nb: ord,
        nn: ord,
    });

    it('Kan mappe sivilstandenum til språktekster', () => {
        const frittståendeOrdTekster = {
            sivilstandUgift: toLocaleRecordString('ugift'),
            sivilstandGift: toLocaleRecordString('gift'),
            sivilstandEnkeEnkemann: toLocaleRecordString('enke'),
            sivilstandSkilt: toLocaleRecordString('skilt'),
            sivilstandSeparert: toLocaleRecordString('separert'),
            sivilstandRegistrertPartner: toLocaleRecordString('registrert partner'),
            sivilstandSeparertPartner: toLocaleRecordString('separert partner'),
            sivilstandSkiltPartner: toLocaleRecordString('skilt partner'),
            sivilstandGjenlevendePartner: toLocaleRecordString('gjenlevende'),
            sivilstandUoppgitt: toLocaleRecordString('uoppgitt'),
            kontantstoette: toLocaleRecordString(''),
            ordinaerBarnetrygd: toLocaleRecordString(''),
            utvidetBarnetrygd: toLocaleRecordString(''),
        } as IFrittståendeOrdTekstinnhold;

        expect(hentSivilstatusSpråkId(frittståendeOrdTekster, ESivilstand.GIFT)).toEqual(
            frittståendeOrdTekster.sivilstandGift
        );
        expect(hentSivilstatusSpråkId(frittståendeOrdTekster, ESivilstand.UGIFT)).toEqual(
            frittståendeOrdTekster.sivilstandUgift
        );
        expect(
            hentSivilstatusSpråkId(frittståendeOrdTekster, ESivilstand.ENKE_ELLER_ENKEMANN)
        ).toEqual(frittståendeOrdTekster.sivilstandEnkeEnkemann);
        expect(hentSivilstatusSpråkId(frittståendeOrdTekster, ESivilstand.SKILT)).toEqual(
            frittståendeOrdTekster.sivilstandSkilt
        );
        expect(hentSivilstatusSpråkId(frittståendeOrdTekster, ESivilstand.SEPARERT)).toEqual(
            frittståendeOrdTekster.sivilstandSeparert
        );
        expect(
            hentSivilstatusSpråkId(frittståendeOrdTekster, ESivilstand.REGISTRERT_PARTNER)
        ).toEqual(frittståendeOrdTekster.sivilstandRegistrertPartner);
        expect(
            hentSivilstatusSpråkId(frittståendeOrdTekster, ESivilstand.SEPARERT_PARTNER)
        ).toEqual(frittståendeOrdTekster.sivilstandSeparertPartner);
        expect(hentSivilstatusSpråkId(frittståendeOrdTekster, ESivilstand.SKILT_PARTNER)).toEqual(
            frittståendeOrdTekster.sivilstandSkiltPartner
        );
        expect(
            hentSivilstatusSpråkId(frittståendeOrdTekster, ESivilstand.GJENLEVENDE_PARTNER)
        ).toEqual(frittståendeOrdTekster.sivilstandGjenlevendePartner);
        expect(hentSivilstatusSpråkId(frittståendeOrdTekster, ESivilstand.UOPPGITT)).toEqual(
            frittståendeOrdTekster.sivilstandUoppgitt
        );
    });
});
