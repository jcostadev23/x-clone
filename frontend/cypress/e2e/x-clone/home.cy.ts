/**
 * Home feed: layout, compose, posting tweets, liking, and commenting.
 */

before(() => {
  cy.registerTestUser();
});

describe("Home page layout", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.login();
    cy.visit("/");
  });

  it("shows the main feed with Home header", () => {
    cy.contains("Home").should("be.visible");
  });

  it("shows the For you / Following tabs", () => {
    cy.contains("For you").should("be.visible");
    cy.contains("Following").should("be.visible");
  });

  it("shows the compose area", () => {
    cy.get('[data-cy="post-tweet-form"]').should("be.visible");
    cy.get('[data-cy="tweet-textarea"]').should("be.visible");
    cy.get('[data-cy="post-tweet-btn"]').should("be.visible");
  });

  it("Post button is disabled when textarea is empty", () => {
    cy.get('[data-cy="post-tweet-btn"]').should("be.disabled");
  });

  it("shows the left navigation sidebar", () => {
    cy.contains("Explore").should("be.visible");
    cy.contains("Notifications").should("be.visible");
    cy.contains("Messages").should("be.visible");
    cy.contains("Post").should("be.visible");
  });

  it("shows the right sidebar with trends", () => {
    cy.contains("What's happening").should("be.visible");
    cy.contains("Who to follow").should("be.visible");
  });
});

describe("Posting a tweet", () => {
  const tweetText = `Cypress test tweet ${Date.now()}`;

  before(() => {
    cy.registerTestUser();
    cy.login();
    cy.visit("/");
  });

  it("enables Post button when text is entered", () => {
    cy.get('[data-cy="tweet-textarea"]').type(tweetText);
    cy.get('[data-cy="post-tweet-btn"]').should("not.be.disabled");
  });

  it("posts a tweet and shows it in the feed", () => {
    cy.get('[data-cy="tweet-textarea"]').clear().type(tweetText);
    cy.get('[data-cy="post-tweet-btn"]').click();
    cy.get('[data-cy="tweet-textarea"]').should("have.value", "");
    cy.contains(tweetText).should("be.visible");
  });

  it("shows a character counter when near the 280 limit", () => {
    const longText = "a".repeat(265);
    cy.get('[data-cy="tweet-textarea"]').clear().type(longText);
    cy.contains("15").should("be.visible");
  });

  it("disables Post button when over 280 characters", () => {
    const overLimit = "a".repeat(281);
    cy.get('[data-cy="tweet-textarea"]').clear().type(overLimit);
    cy.get('[data-cy="post-tweet-btn"]').should("be.disabled");
  });
});
