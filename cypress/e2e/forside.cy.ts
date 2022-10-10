import { RouteEnum } from '../../src/frontend/typer/routes';
import { hentRoute } from '../support/utils';

describe('Forside', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Ingen tekster skal være tomme', () => {
        cy.get(
            '#root > * p,' +
                '#root > * label,' +
                '#root > * span,' +
                '#root > * h1,' +
                '#root > * h2,' +
                '#root > * h3,' +
                '#root > * h4,' +
                '#root > * h5'
        )
            .should('have.length.at.least', 1)
            .each($text => {
                cy.wrap($text).should('not.have.text', '');
            });
    });

    it('Skal vise error dersom man prøver å starte søknad uten å ha avhuket bekreftelsesboks. Når den er avhuket skal man kunne navigere til "Om deg" siden', () => {
        cy.get('[data-testid="start-søknad-knapp"]').click();
        cy.get('[data-testid="bekreftelsesboks-container"]');
        cy.find('.bekreftCheckboksPanel').should('have.class', 'bekreftCheckboksPanel--error');
        cy.url().should('eq', Cypress.env('baseUrl') + hentRoute(RouteEnum.Forside).path);

        cy.get('[data-testid="bekreftelsesboks-container"]').find('.skjemaelement').click();

        cy.get('[data-testid="start-søknad-knapp"]').click();
        cy.url().should('eq', Cypress.env('baseUrl') + hentRoute(RouteEnum.OmDeg).path);
    });
});
