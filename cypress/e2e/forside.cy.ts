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
});
