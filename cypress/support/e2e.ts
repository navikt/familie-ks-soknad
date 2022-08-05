import { mockDataFixture } from '../../MockResponse';

beforeEach(() => {
    cy.intercept(
        'GET',
        new RegExp('^http://localhost:8080/api/personopplysning/'),
        mockDataFixture()
    ).as('personopplysningerRequest');
});
