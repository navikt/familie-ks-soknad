import { exec } from 'child_process';

import en from '../frontend/assets/lang/en.json' assert { type: 'json' };
import nb from '../frontend/assets/lang/nb.json' assert { type: 'json' };
import nn from '../frontend/assets/lang/nn.json' assert { type: 'json' };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const finnMuligensUbrukteIder = (alleBenyttedeSpråkIder, språkfil, språkfilNavn) => {
    console.info('------------------------------------------------------------');
    console.info(`ubrukte språkId'er i ${språkfilNavn}.json: 
`);
    const iderSomIkkeErIBruk = Object.keys(språkfil).filter(
        key => !alleBenyttedeSpråkIder.includes(key)
    );
    iderSomIkkeErIBruk.forEach(key => {
        console.info(`Ikke i bruk? -> ${key}`);
    });
    return iderSomIkkeErIBruk;
};

/**
 * Skriptet finner *nesten* alle tekst id'er som er i bruk i ./src/frontend
 * i package.json må "type": "module" fjernes for å kunne gjøre scriptet
 *
 * TODO:
 * inkludere id'er med formen 'aaa-bbb.asdf'
 */
exec(
    `grep -r -oh -I --exclude '.json' --exclude '.test.ts' -E "([\\'|\\"]{1,1}([a-zA-ZæøåÆØÅ]+\\.{1,1})(([a-zA-ZæøåÆØÅ]+\\.{1,1})|([a-zA-ZæøåÆØÅ]+\\_{1,1})|([a-zA-ZæøåÆØÅ]+\\-{1,1}))*[a-zA-ZæøåÆØÅ]+[\\'|\\"]{1,1})" ./src/frontend`,
    (_, stdout) => {
        let alleMatchendeIder = stdout.split('\n');

        let alleBenyttedeSpråkIder = [...new Set(alleMatchendeIder)]
            .map(elem => {
                return elem.slice(1, elem.length - 1);
            })
            .filter(elem => {
                if (elem.length === 0) {
                    return false;
                }
                return !(
                    elem === 'DD.MM.YYYY' ||
                    elem === 'DD.MM.YY' ||
                    elem === 'www.nav' ||
                    elem === 'www.nav.no' ||
                    elem === 'favicon.ico' ||
                    elem === 'DD.MM.ÅÅÅÅ'
                );
            });

        console.info('------------------------------------------------------------');
        console.info("språkid'er som mangler i nb.json: \n");
        alleBenyttedeSpråkIder.forEach(elem => {
            if (!(elem in nb)) {
                console.info(`ERROR -> ${elem}`);
            }
        });

        console.info('------------------------------------------------------------');
        console.info("språkid'er som mangler i nn.json: \n");
        alleBenyttedeSpråkIder.forEach(elem => {
            if (!(elem in nn)) {
                console.info(`ERROR -> ${elem}`);
            }
        });
        console.info('------------------------------------------------------------');
        console.info("språkid'er som mangler i en.json: \n");
        alleBenyttedeSpråkIder.forEach(elem => {
            if (!(elem in en)) {
                console.info(`ERROR -> ${elem}`);
            }
        });

        // console.info('------------------------------------------------------------');
        // const iderSomIkkeErIBrukNB = finnMuligensUbrukteIder(alleBenyttedeSpråkIder, nb, 'NB');
        // const iderSomIkkeErIBrukNN = finnMuligensUbrukteIder(alleBenyttedeSpråkIder, nn, 'NN');
        // const iderSomIkkeErIBrukEN = finnMuligensUbrukteIder(alleBenyttedeSpråkIder, en, 'EN');

        // console.info(`nb length: ${Object.keys(nb).length}`);
        // console.info(`antall benyttede språknøkkler: ${alleBenyttedeSpråkIder.length}`);
        // console.info(`Ider som ikke er i bruk fra nb.json: ${iderSomIkkeErIBrukNB.length}`);
        // console.info(`Ider som ikke er i bruk fra nn.json: ${iderSomIkkeErIBrukNN.length}`);
        // console.info(`Ider som ikke er i bruk fra en.json: ${iderSomIkkeErIBrukEN.length}`);
    }
);
