/**
 * User profile page: navigation, layout, and follow/unfollow.
 */

before(() => {
  cy.registerTestUser();
});

describe("Profile page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get('[data-cy="tweet-card"]').should("have.length.gte", 1);
  });

  it("navigates to a user profile when clicking a username", () => {
    cy.get('[data-cy="tweet-card"]')
      .first()
      .find("a")
      .first()
      .click();
    cy.url().should("match", /\/user\/.+/);
  });

  it("shows the profile page with correct layout", () => {
    cy.get('[data-cy="tweet-card"]')
      .first()
      .find("a")
      .first()
      .click();

    cy.contains("Following").should("be.visible");
    cy.contains("Followers").should("be.visible");
    cy.contains("Posts").should("be.visible");
    cy.contains("Replies").should("be.visible");
  });

  it("shows a Follow button on another user's profile", () => {
    // Post a tweet as our test user so we can click their name
    cy.visit("/");
    cy.get('[data-cy="tweet-card"]')
      .first()
      .find("a")
      .first()
      .click();
    cy.url().should("match", /\/user\/.+/);

    // Follow button should be visible (starts unfollowed)
    cy.contains("button", "Follow").should("be.visible");
  });

  it("toggles Follow → Following on click", () => {
    cy.get('[data-cy="tweet-card"]')
      .first()
      .find("a")
      .first()
      .click();

    cy.contains("button", "Follow").click();
    cy.contains("button", "Following").should("be.visible");
  });

  it("toggles Following → Follow on second click (unfollow)", () => {
    cy.get('[data-cy="tweet-card"]')
      .first()
      .find("a")
      .first()
      .click();

    cy.contains("button", "Follow").click();
    cy.contains("button", "Following").click();
    cy.contains("button", "Follow").should("be.visible");
  });
});

describe("Profile page — back navigation", () => {
  it("back arrow returns to home feed", () => {
    cy.login();
    cy.visit("/");
    cy.get('[data-cy="tweet-card"]').first().find("a").first().click();
    cy.url().should("match", /\/user\/.+/);
    cy.get('a[aria-label]').first().click(); // back arrow link
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });
});
