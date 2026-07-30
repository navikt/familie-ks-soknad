# familie-ks-soknad
Frontend - søknad for kontantstøtte.

Dette er en skinnet kopi av barnetrygdsøknaden (kopiert 2.8.22): https://github.com/navikt/familie-ba-soknad
ADR-dokument: https://github.com/navikt/familie/blob/master/doc/adr/0008-KS-lager-egen-søknadsdialog-app.md

# Lokal utvikling

## Avhengigheter
1. Node versjon >=20
2. familie-baks-soknad-api (https://github.com/navikt/familie-baks-soknad-api)
3. NVM (https://github.com/nvm-sh/nvm)

## Logg inn på https://npm.pkg.github.com
1. På github -> Settings -> Developer Settings -> Generate New Token
   Select scopes `repo` og `read:packages`
2. Eksporter miljøvariabel NPM_TOKEN, f.eks ved å legge til
   `export NPM_TOKEN=<ditt token>` i ~/.zshrc

## Legg til token for unleash for lokalmiljø
1. Hent development token fra [unleash](https://teamfamilie-unleash-web.iap.nav.cloud.nais.io/admin/api)
2. Legg til variabelen UNLEASH_SERVER_API_TOKEN i `.env`: `UNLEASH_SERVER_API_TOKEN=<ditt token>`

## Kjør lokalt

Prosjektet bruker [pnpm](https://pnpm.io/) som pakkehåndterer. Riktig pnpm-versjon er
låst via `packageManager`-feltet i `package.json` og hentes automatisk av
[Corepack](https://nodejs.org/api/corepack.html) (fulgte med Node.js). Kjør `corepack enable`
én gang for å aktivere Corepack, så vil riktig pnpm-versjon brukes automatisk i prosjektet.

1. `nvm use`
2. `corepack enable`
3. `pnpm install`
4. `pnpm start:dev`
5. Kjør opp familie-baks-soknad-api

### Mellomlagring
For å kjøre med mellomlagring må du ha familie-dokument kjørende (https://github.com/navikt/familie-dokument).

### Kjør lokalt mot dev-miljøet (uten å kjøre familie-baks-soknad-api/familie-dokument lokalt)
Hvis du ikke ønsker å kjøre `familie-baks-soknad-api` og `familie-dokument` lokalt, kan du kjøre appen
lokalt mens den snakker med de ekte tjenestene i dev-gcp. Dette krever at du er tilkoblet naisdevice.

1. `pnpm hent-preprod-tokens` — spør deg om et fødselsnummer, og åpner deretter en nettleser som logger inn
   via test-ID-porten (TestId) for begge tjenestene (`familie-baks-soknad-api` og `familie-dokument`).
   La svaret stå tomt for å bruke "Hent tilfeldig person" i stedet. Access-tokenene som hentes lagres
   som `BAKS_SOKNAD_API_TOKEN` og `DOKUMENT_API_TOKEN` i `.env` (filen opprettes om den ikke finnes).
2. `pnpm start:dev:lokalt-mot-preprod`

Tokenene utløper etter en stund — kjør `pnpm hent-preprod-tokens` på nytt for å hente ferske tokens.

# Bygg og deploy
Appen bygges hos github actions, og gir beskjed til nais deploy om å deployere appen i gcp. Alle commits til brancher går til dev miljøet, appen er ikke satt opp i produksjon enda.

# Tekster
Tekster hentes fra Sanity. Se [repo](https://github.com/navikt/familie-baks-soknad-sanity) og [Sanity studio](https://familie-baks-soknad.sanity.studio/production/structure)

# Feature toggles (Unleash)

Vi benytter `Unleash` for opprettelse av feature toggles i applikasjonen.

## Opprette ny toggle

I Unleash:
1. Gå til https://unleash.nais.io/#/features og opprett ny toggle ved å klikke på pluss-ikonet
2. Gi navn på ny toggle med prefix `familie-ks-soknad.`. Eks: `familie-ks-soknad.ny_toggle`
3. Legg til `activation strategy` = `byCluster` og spesifiser `dev-gcp` og/eller `prod-gcp` (Begge dersom toggelen skal benyttes i begge miljøer)

I kode:
1. Gå til fila `typer/feature-toggles.ts` og legg til ny toggle i enumen `EFeatureToggle` og registrer navnet på toggelen fra Unleash i `ToggleKeys`
2. Dersom toggelen skal defaulte til noe annet enn false må dette legges inn i `defaultFeatureToggleValues`

Eks:

```ts
// Legg til nye feature toggles her
export enum EFeatureToggle {
    NY_TOGGLE = 'NY_TOGGLE',
}

// Definer alle feature toggle keys her
export const ToggleKeys: Record<EFeatureToggle, string> = {
    [EFeatureToggle.NY_TOGGLE]: 'familie-ks-soknad.ny_toggle',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

// Default verdier som brukes dersom man ikke finner feature toggle i unleash.
export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
    // Dersom noen toggler ikke skal være default false:
    ...{ [EFeatureToggle.NY_TOGGLE]: true },
};
```

Toggelen kan deretter tas ibruk på følgende måte:

```ts
const { toggles } = useFeatureToggles();

if (toggles.NY_TOGGLE) {
    // Kode som kjører dersom NY_TOGGLE er enabled i Unleash
}
```

# Test av PDF
Etter at søknaden er sendt inn, vil det genereres en PDF basert på svarene som er gitt. Søknaden går først til `familie-baks-soknad-api` før den sendes over til `familie-baks-mottak` som forbereder og trigger PDF-generering i `familie-dokument`. For å teste hele dette løpet trenger man derfor å kjøre opp alle disse applikasjonene:
* `familie-ks-soknad` (`pnpm start:dev`)
* `familie-baks-soknad-api` (Kjør `LokalLauncher.kt`, se `README.md`)
* `familie-dokument` (Kjør `ApplicationLocalSoknad.kt`)
* `familie-baks-mottak` (Kjør `DevLauncherPostgress.kt`, se `README.md`)

I dev og prod kan man se den genererte PDF'en inne i Gosys, men når man jobber lokalt har vi ingen kobling dit. For å generere og se PDF'en, bruker vi istedenfor debug-breakpoint eller logging i `familie-baks-mottak`.

## Hent input til PDF-generering fra baks-mottak

I `familie-baks-mottak`, naviger til `PdfService.kt` og metoden `lagKontantstøttePdf`. Legg inn følgende kode før metoden returnerer:

```kotlin
logger.info(objectMapper.writeValueAsString(kontantstøtteSøknadMapForSpråk + ekstraFelterMap))
```

Kopier JSON-stringen som logges til konsollen.

## Generer PDF manuelt med Swagger

Naviger til Swagger-urlen til `familie-baks-dokgen`: http://localhost:5914/swagger-ui/index.html og finn "download-pdf" endepunktet. Her velger man "Try it out" og fyller inn `templateName = kontantstotte-soknad`, limer inn den kopierte JSON-stringen i `Request body` og trykker "Execute". Det vil da dukke opp en "Download now" lenke du kan trykke på for å se den genererte PDF'en.


# Tilgjengelighetserklæring

Applikasjonens tilgjengelighetserklæring ligger lagret som filen `UU-rapport.json` og kan åpnes og redigeres i verktøyet [WCAG-EM Report Tool](https://www.w3.org/WAI/eval/report-tool/). For mer informasjon om tilgjengelighetserklæring se [Aksel](https://aksel.nav.no/produktbloggen/tilgjengelighetserklaringer-kom-i-gang).

# Henvendelser
Ved spørsmål knyttet til koden eller prosjektet opprett en issue.

## For Nav-ansatte
Interne henvendelser kan sendes via Slack i kanalen #team-familie.

### Logging til Sentry
https://sentry.gc.nav.no/nav/familie-ks-soknad/

Bruk tag ``` scope:familie-ks-soknad ``` for å filtrere på kun exceptions fanget opp av Sentry.ErrorBoundary (dette vil f eks filtrere ut alle exceptions som nav-dokoratøren kaster)
