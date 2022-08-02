export default function () {
    if (process.env.ENV === 'prod') {
        return {
            apiUrl: 'http://familie-ba-soknad-api',
            port: 9000,
        };
    } else if (process.env.ENV === 'dev') {
        return {
            apiUrl: 'http://familie-ba-soknad-api',
            port: 9000,
        };
    } else {
        return {
            apiUrl: 'http://localhost:8080',
            dekoratørUrl: 'https://www.nav.no/dekoratoren/',
            port: 55554,
        };
    }
}

export const basePath = process.env.BASE_PATH ?? '/';
