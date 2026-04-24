/// <reference types="cypress" />

const API = "http://localhost:4000";

const TEST_USER = {
  userName: "cypress_user",
  email: "cypress@xclone.test",
  password: "Cypress1234!",
  birthDate: "1990-01-01",
};

/**
 * Registers the shared test user, silently ignoring 409 if they already exist.
 * Call once in a before() block for suites that need an authenticated user.
 */
Cypress.Commands.add("registerTestUser", () => {
  cy.request({
    method: "POST",
    url: `${API}/users`,
    body: { user: TEST_USER },
    failOnStatusCode: false,
  });
});

/**
 * Programmatic login — bypasses the UI and sets the httpOnly cookie directly.
 * Much faster than clicking through the sign-in form.
 */
Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: `${API}/signin`,
    body: { userName: TEST_USER.userName, password: TEST_USER.password },
    failOnStatusCode: false,
  }).its("status").should("eq", 200);
});

/**
 * Returns the shared test-user credentials for form-level tests.
 */
Cypress.Commands.add("getTestUser", () => {
  return cy.wrap(TEST_USER);
});

declare global {
  namespace Cypress {
    interface Chainable {
      registerTestUser(): Chainable<void>;
      login(): Chainable<void>;
      getTestUser(): Chainable<typeof TEST_USER>;
    }
  }
}
