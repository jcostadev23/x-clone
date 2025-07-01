describe("Home page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should render the component with correct user name, date and description", () => {
    cy.get("[data-cy=TweetCardHeader]")
      .first()
      .within(() => {
        cy.contains("strong", "Jose Costa").should("exist");
        cy.contains("span", "07/04/2025").should("exist");
        cy.contains("h3", "This is my secound tweet").should("exist");
      });
  });

  it("should render the component with correct comments amount, reposts, views", () => {
    cy.get("[data-cy=TweetCardFooter]")
      .first()
      .within(() => {
        cy.contains("button", "2").should("exist");
        cy.contains("div", "123k").should("exist");
        cy.contains("div", "4.5m").should("exist");
      });
  });
});

describe("Adding comment", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("can add new comment", () => {
    const newComment = "This is my comment from cypress test";

    cy.get("[data-cy=TweetCardFooter]")
      .last()
      .within(() => {
        cy.contains("button", "0").click();
      });

    cy.get("[data-cy=new-comment]").type(`${newComment}{enter}`);
  });
});
