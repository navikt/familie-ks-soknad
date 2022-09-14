import { ESivilstand } from '../../typer/kontrakt/generelle';
import { hentSivilstatusSpråkId } from '../../utils/språk';
import { silenceConsoleErrors } from '../../utils/testing';

silenceConsoleErrors();

describe('useSendInnSkjema', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    it('Kan mappe sivilstandenum til språktekster', () => {
        const språktekster = Object.values(ESivilstand).map(hentSivilstatusSpråkId);
        let sivilstandCount = 0;
        for (const sivilstand in ESivilstand) {
            expect(språktekster).toContain(`felles.sivilstatus.kode.${sivilstand}`);
            sivilstandCount++;
        }
        expect(språktekster.length).toEqual(sivilstandCount);
    });
});
