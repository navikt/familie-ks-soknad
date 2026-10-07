export function utledInnloggetStatus(isSuccess: boolean, isPending: boolean, isError: boolean) {
    if (isPending) {
        return InnloggetStatus.IKKE_VERIFISERT;
    }
    if (isError) {
        return InnloggetStatus.FEILET;
    }
    if (isSuccess) {
        return InnloggetStatus.AUTENTISERT;
    }
    return InnloggetStatus.IKKE_VERIFISERT;
}

export enum InnloggetStatus {
    AUTENTISERT,
    FEILET,
    IKKE_VERIFISERT,
}
