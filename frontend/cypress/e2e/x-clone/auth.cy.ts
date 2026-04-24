/**
 * Auth flow: sign-in page, create account modal, sign-in modal.
 * Runs against a real backend at localhost:4000.
 */

const TEST_USER = {
  userName: "cypress_user",
  password: "Cypress1234!",
  email: "cypress@xclone.test",
  birthDate: "1990-01-01",
};

// Unique user for the registration test (avoids 409 conflicts on re-runs)
const newUser = () => ({
  userName: `cy_reg_${Date.now()}`,
  email: `cy_reg_${Date.now()}@xclone.test`,
  password: "NewUser1234!",
  birthDate: "1995-06-15",
});

before(() => {
  // Ensure the shared test user exists before any auth tests run
  cy.registerTestUser();
});

describe("Sign-in page", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("/signin");
  });

  it("displays the sign-in page with logo and buttons", () => {
    cy.contains("Happening now").should("be.visible");
    cy.contains("Join today").should("be.visible");
    cy.contains("button", "Create account").should("be.visible");
    cy.contains("button", "Sign in").should("be.visible");
  });

  it("unauthenticated visit to / redirects to /signin", () => {
    cy.visit("/");
    cy.url().should("include", "/signin");
  });
});

describe("Create account", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("/signin");
    cy.contains("button", "Create account").click();
  });

  it("opens the create-account modal", () => {
    cy.contains("Create your account").should("be.visible");
    cy.get('input[placeholder="Username"]').should("be.visible");
    cy.get('input[placeholder="Email"]').should("be.visible");
    cy.get('input[placeholder="Password"]').should("be.visible");
    cy.get('input[placeholder="Date of birth"]').should("be.visible");
  });

  it("submit button is disabled when fields are empty", () => {
    cy.contains("button", "Create account").last().should("be.disabled");
  });

  it("registers a new user and lands on the home page", () => {
    const user = newUser();
    cy.get('input[placeholder="Username"]').type(user.userName);
    cy.get('input[placeholder="Email"]').type(user.email);
    cy.get('input[placeholder="Password"]').type(user.password);
    cy.get('input[placeholder="Date of birth"]').type(user.birthDate);
    cy.contains("button", "Create account").last().click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
    cy.contains("Home").should("be.visible");
  });

  it("shows an error when username is already taken", () => {
    cy.get('input[placeholder="Username"]').type(TEST_USER.userName);
    cy.get('input[placeholder="Email"]').type("other@xclone.test");
    cy.get('input[placeholder="Password"]').type(TEST_USER.password);
    cy.get('input[placeholder="Date of birth"]').type("1990-01-01");
    cy.contains("button", "Create account").last().click();
    cy.contains("already in use").should("be.visible");
  });
});

describe("Sign in", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("/signin");
    cy.contains("button", "Sign in").click();
  });

  it("opens the sign-in modal", () => {
    cy.contains("Sign in to X").should("be.visible");
    cy.get('input[placeholder="Username"]').should("be.visible");
    cy.get('input[placeholder="Password"]').should("be.visible");
  });

  it("submit is disabled when fields are empty", () => {
    cy.contains("button", "Sign in").last().should("be.disabled");
  });

  it("shows an error for wrong credentials", () => {
    cy.get('input[placeholder="Username"]').type("wronguser");
    cy.get('input[placeholder="Password"]').type("wrongpass");
    cy.contains("button", "Sign in").last().click();
    cy.contains("Invalid username or password").should("be.visible");
  });

  it("signs in with valid credentials and redirects to home", () => {
    cy.get('input[placeholder="Username"]').type(TEST_USER.userName);
    cy.get('input[placeholder="Password"]').type(TEST_USER.password);
    cy.contains("button", "Sign in").last().click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
    cy.contains("Home").should("be.visible");
  });
});
