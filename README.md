# familie-ks-soknad
Frontend - søknad for kontantstøtte.

Dette er en skinnet kopi av barnetrygdsøknaden (kopiert 2.8.22): https://github.com/navikt/familie-ba-soknad
ADR-dokument: https://github.com/navikt/familie/blob/master/doc/adr/0008-KS-lager-egen-søknadsdialog-app.md

## Avhengigheter
1. Node versjon >=16
2. familie-baks-soknad-api (https://github.com/navikt/familie-baks-soknad-api)

## Log in på https://npm.pkg.github.com
På github -> Settings -> Developer Settings -> Generate New Token
Select scopes `repo` og `read:packages`

eksporter miljøvariabel NPM_TOKEN, f eks ved å legge til
`export NPM_TOKEN=<ditt token>` i ~/.zshrc
-
## Kjør lokalt
1. `yarn install`
2. `yarn start:dev`
3. Kjør opp familie-baks-soknad-api

### Mellomlagring
For å kjøre med mellomlagring må du ha familie-dokument kjørende (https://github.com/navikt/familie-dokument).

# Bygg og deploy
Appen bygges hos github actions, og gir beskjed til nais deploy om å deployere appen i gcp. Alle commits til brancher går til dev miljøet, appen er ikke satt opp i produksjon enda.

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
Etter at søknaden er sendt inn, vil det genereres en PDF basert på svarene som er gitt. Søknaden går først til `familie-baks-soknad-api` før den sendes over til `familie-baks-mottak` som forbereder og trigger PDF-generering i appen `familie-baks-dokgen`. For å teste hele dette løpet trenger man derfor å kjøre opp alle disse applikasjonene:
* `familie-ks-soknad` (`yarn start:dev`)
* `familie-baks-soknad-api` (Kjør `LokalLauncher.kt`, se `README.md`)
* `familie-dokument` (Kjør `ApplicationLocalSoknad.kt`, Valgfri)
* `familie-baks-mottak` (Kjør `DevLauncherPostgress.kt`, se `README.md`)
* `familie-baks-dokgen` (Se `README.md`)

I dev og prod kan man se den genererte PDF'en inne i Gosys, men når man jobber lokalt har vi ingen kobling dit. For å generere og se PDF'en, bruker vi istedenfor Swagger i `familie-baks-dokgen` og debug-breakpoint eller logging i `familie-baks-mottak`.

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

## For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen #team-familie.

### Logging til Sentry
https://sentry.gc.nav.no/nav/familie-ks-soknad/

Bruk tag ``` scope:familie-ks-soknad ``` for å filtrere på kun exceptions fanget opp av Sentry.ErrorBoundary (dette vil f eks filtrere ut alle exceptions som nav-dokoratøren kaster)
