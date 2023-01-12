const cspMap = (dekoratorenUrl: string): Record<string, string[]> => {
    return {
        'default-src': ["'self'"],
        'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            dekoratorenUrl + '/client.js',
            'account.psplugin.com',
            'in2.taskanalytics.com',
            'static.hotjar.com',
            'script.hotjar.com',
            'vars.hotjar.com',
        ],
        'style-src': ["'self'", "'unsafe-inline'", dekoratorenUrl + '/css/client.css'],
        'connect-src': [
            "'self'",
            '*.nav.no',
            'by26nl8j.apicdn.sanity.io',
            'amplitude.nav.no',
            '*.psplugin.com',
            'familie-dokument.dev.nav.no',
            'vc.hotjar.io',
            'localhost:8082',
        ],
        'font-src': ["'self'", 'data:', '*.psplugin.com'],
        'frame-src': ['vars.hotjar.com'],
        'img-src': ["'self'", 'www.nav.no', 'data:'],
        'worker-src': ["'self'", 'blob:'],
    };
};

export const cspString = (dekoratorenUrl: string) => {
    return Object.entries(cspMap(dekoratorenUrl))
        .map(entry => `${entry[0]} ${entry[1].join(' ')}`)
        .join('; ');
};
