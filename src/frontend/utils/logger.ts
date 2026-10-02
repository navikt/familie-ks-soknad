import { BASE_PATH } from '../../common/miljø';
import type { LoggNivå, LoggPayload } from '../../common/typer/logg';

interface LoggFeil {
    name?: string;
    stack?: string;
}

export const tilLoggFeil = (feil: unknown): LoggFeil =>
    feil instanceof Error ? { name: feil.name, stack: feil.stack } : {};

const LOGG_ENDEPUNKT = `${BASE_PATH}logg`;

const sendLogg = (loglevel: LoggNivå, message: string, feil?: LoggFeil): void => {
    const payload: LoggPayload = { loglevel, message, name: feil?.name, stack: feil?.stack };
    // Fire-and-forget: logging skal aldri kaste eller blokkere applikasjonen.
    void fetch(LOGG_ENDEPUNKT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
    }).catch(() => undefined);
};

/**
 * Frontend-logger som sender strukturerte logglinjer til BFF-ens `/logg`-endepunkt,
 * som igjen logger dem via pino. Send aldri fødselsnummer eller andre personopplysninger.
 */
export const logger = {
    error: (message: string, feil?: LoggFeil): void => sendLogg('error', message, feil),
    warn: (message: string, feil?: LoggFeil): void => sendLogg('warn', message, feil),
    info: (message: string, feil?: LoggFeil): void => sendLogg('info', message, feil),
    debug: (message: string, feil?: LoggFeil): void => sendLogg('debug', message, feil),
    trace: (message: string, feil?: LoggFeil): void => sendLogg('trace', message, feil),
};
