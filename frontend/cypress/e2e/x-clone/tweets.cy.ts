/**
 * Tweet interactions: liking, unliking, and commenting.
 */

before(() => {
  cy.registerTestUser();
});

describe("Like / Unlike", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    // Ensure at least one tweet exists
    cy.get('[data-cy="tweet-card"]').should("have.length.gte", 1);
  });

  it("can like the first tweet", () => {
    cy.get('[data-cy="tweet-card"]')
      .first()
      .find('[data-cy="tweet-like-btn"]')
      .as("likeBtn");

    // Capture current like count (could be empty string if 0)
    cy.get("@likeBtn").invoke("text").then((before) => {
      cy.get("@likeBtn").click();
      // After liking, count should increase by 1 or become "1"
      cy.get("@likeBtn").invoke("text").then((after) => {
        const beforeCount = parseInt(before.trim()) || 0;
        const afterCount = parseInt(after.trim()) || 0;
        expect(afterCount).to.eq(beforeCount + 1);
      });
    });
  });

  it("can unlike a tweet that is already liked", () => {
    cy.get('[data-cy="tweet-card"]')
      .first()
      .find('[data-cy="tweet-like-btn"]')
      .as("likeBtn");

    // Like first
    cy.get("@likeBtn").click();
    cy.get("@likeBtn").invoke("text").then((liked) => {
      const likedCount = parseInt(liked.trim()) || 0;
      // Unlike
      cy.get("@likeBtn").click();
      cy.get("@likeBtn").invoke("text").then((unliked) => {
        const unlikedCount = parseInt(unliked.trim()) || 0;
        expect(unlikedCount).to.eq(likedCount - 1);
      });
    });
  });
});

describe("Comment on a tweet", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get('[data-cy="tweet-card"]').should("have.length.gte", 1);
  });

  it("opens the comment modal when clicking the comment button", () => {
    cy.get('[data-cy="tweet-card"]')
      .first()
      .find('[data-cy="tweet-comment-btn"]')
      .click();
    cy.get('[data-cy="comment-textarea"]').should("be.visible");
    cy.get('[data-cy="comment-submit-btn"]').should("be.visible");
  });

  it("submit is disabled when comment is empty", () => {
    cy.get('[data-cy="tweet-card"]')
      .first()
      .find('[data-cy="tweet-comment-btn"]')
      .click();
    cy.get('[data-cy="comment-submit-btn"]').should("be.disabled");
  });

  it("can submit a comment and sees the count increase", () => {
    const commentText = `Cypress comment ${Date.now()}`;

    cy.get('[data-cy="tweet-card"]')
      .first()
      .find('[data-cy="tweet-comment-btn"]')
      .as("commentBtn");

    cy.get("@commentBtn").invoke("text").then((before) => {
      const beforeCount = parseInt(before.trim()) || 0;
      cy.get("@commentBtn").click();
      cy.get('[data-cy="comment-textarea"]').type(commentText);
      cy.get('[data-cy="comment-submit-btn"]').click();
      // Modal closes after submit
      cy.get('[data-cy="comment-textarea"]').should("not.exist");
      // Comment count increases
      cy.get('[data-cy="tweet-card"]')
        .first()
        .find('[data-cy="tweet-comment-btn"]')
        .invoke("text")
        .then((after) => {
          const afterCount = parseInt(after.trim()) || 0;
          expect(afterCount).to.eq(beforeCount + 1);
        });
    });
  });
});
