// CSP eller Content-Security-Policy er en HTTP-Header som lar oss spesifisere hvor appen kan kjøre REST-kall mot og hvor den kan hente diverse innhold fra (fonter, bilder, javascript, stylesheets mm).
const cspMap = (dekoratorenUrl: string): Record<string, string[]> => {
    return {
        'default-src': ["'self'"],
        // Hvor vi kan hente .js filer fra.
        'script-src': [
            "'self'",
            "'unsafe-inline'", // Må fjernes når de har gått bort fra å bruke GTM i nav-dekoratøren. https://nav-it.slack.com/archives/CAFRFDJMN/p1662980327936219?thread_ts=1662547757.895479&cid=CAFRFDJMN. Litt av poenget med CSP header faller bort når vi er nødt til å bruke 'unsafe-inline' så denne burde fjernes så fort det er mulig.
            "'unsafe-eval'",
            dekoratorenUrl + '/client.js',
            'account.psplugin.com',
            'in2.taskanalytics.com',
            'static.hotjar.com',
            'script.hotjar.com',
            'vars.hotjar.com',
        ],
        // Hvor vi kan hente .css filer fra.
        'style-src': ["'self'", "'unsafe-inline'", dekoratorenUrl + '/css/client.css'],
        // Hvor vi kan kjøre XHR/REST-kall mot.
        'connect-src': [
            "'self'",
            '*.nav.no',
            'by26nl8j.apicdn.sanity.io',
            'amplitude.nav.no',
            '*.psplugin.com',
            'familie-dokument.dev.nav.no',
            'vc.hotjar.io',
        ],
        // Kan kun submitte forms til seg selv.
        'form-action': ["'self'"],
        // Ingen kan embedde appen på egen nettside.
        'frame-ancestors': ["'none'"],
        // Hvor fonter kan hentes fra.
        'font-src': ["'self'", 'data:', '*.psplugin.com'],
        // Hvor vi hente innhold til iFrames fra.
        'frame-src': ['vars.hotjar.com'],
        // Hvor bilder kan hentes fra.
        'img-src': ["'self'", 'www.nav.no', 'data:'],
        'worker-src': ["'self'", 'blob:'],
        // Hvor manifest-filer kan hentes fra
        'manifest-src': ["'self'", 'www.nav.no', 'oidc-ver2.difi.no'],
    };
};

export const cspString = (dekoratorenUrl: string) => {
    return Object.entries(cspMap(dekoratorenUrl))
        .map(entry => `${entry[0]} ${entry[1].join(' ')}`)
        .join('; ');
};
