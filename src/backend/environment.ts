export default function () {
    if (process.env.ENV === 'prod') {
        return {
            apiUrl: 'http://familie-baks-soknad-api',
            isLocal: false,
            port: 9000,
        };
    } else if (process.env.ENV === 'dev') {
        return {
            apiUrl: 'http://familie-baks-soknad-api',
            isLocal: false,
            port: 9000,
        };
    } else {
        return {
            apiUrl: 'http://localhost:8080',
            isLocal: true,
            dekoratørUrl: 'https://www.nav.no/dekoratoren/',
            port: 55554,
        };
    }
}

export const basePath = process.env.BASE_PATH ?? '/';
