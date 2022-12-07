import { ESivilstand } from '../../typer/kontrakt/generelle';
import { ESanitySivilstandApiKey } from '../../typer/sanity/sanity';
import { sivilstandTilSanitySivilstandApiKey } from '../../utils/språk';

describe('useSendInnSkjema', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    it('Kan mappe sivilstandenum til sanity sivilstand', () => {
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.GIFT)).toEqual(
            ESanitySivilstandApiKey.GIFT
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.UGIFT)).toEqual(
            ESanitySivilstandApiKey.UGIFT
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.ENKE_ELLER_ENKEMANN)).toEqual(
            ESanitySivilstandApiKey.ENKE_ELLER_ENKEMANN
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.SKILT)).toEqual(
            ESanitySivilstandApiKey.SKILT
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.SEPARERT)).toEqual(
            ESanitySivilstandApiKey.SEPARERT
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.REGISTRERT_PARTNER)).toEqual(
            ESanitySivilstandApiKey.REGISTRERT_PARTNER
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.SEPARERT_PARTNER)).toEqual(
            ESanitySivilstandApiKey.SEPARERT_PARTNER
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.SKILT_PARTNER)).toEqual(
            ESanitySivilstandApiKey.SKILT_PARTNER
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.GJENLEVENDE_PARTNER)).toEqual(
            ESanitySivilstandApiKey.GJENLEVENDE_PARTNER
        );
        expect(sivilstandTilSanitySivilstandApiKey(ESivilstand.UOPPGITT)).toEqual(
            ESanitySivilstandApiKey.UOPPGITT
        );
    });
});
