# familie-ks-soknad
Frontend - søknad for kontantstøtte.

Dette er en skinnet kopi av barnetrygdsøknaden (kopiert 2.8.22): https://github.com/navikt/familie-ba-soknad
ADR-dokument: https://github.com/navikt/familie/blob/master/doc/adr/0008-KS-lager-egen-søknadsdialog-app.md

## Avhengigheter
1. Node versjon >=16
2. familie-ba-soknad-api (https://github.com/navikt/familie-ba-soknad-api)

## Log in på https://npm.pkg.github.com
På github -> Settings -> Developer Settings -> Generate New Token
Select scopes `repo` og `read:packages`

eksporter miljøvariabel NPM_TOKEN, f eks ved å legge til
`export NPM_TOKEN=<ditt token>` i ~/.zshrc

## Kjør lokalt
1. `yarn install`
2. `yarn start:dev`
3. Kjør opp familie-ba-soknad-api
4. Dersom du ønsker mellomlagring må du også kjøre opp familie-dokument

### Mellomlagring
For å kjøre med mellomlagring må du ha familie-dokument kjørende (https://github.com/navikt/familie-dokument).

# Bygg og deploy
Appen bygges hos github actions, og gir beskjed til nais deploy om å deployere appen i gcp. Alle commits til brancher går til dev miljøet, appen er ikke satt opp i produksjon enda.

# Henvendelser
Ved spørsmål knyttet til koden eller prosjektet opprett en issue.

## For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen #team-familie.

### Logging til Sentry
https://sentry.gc.nav.no/nav/familie-ks-soknad/

Bruk tag ``` scope:familie-ks-soknad ``` for å filtrere på kun exceptions fanget opp av Sentry.ErrorBoundary (dette vil f eks filtrere ut alle exceptions som nav-dokoratøren kaster)
