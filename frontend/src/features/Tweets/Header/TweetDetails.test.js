import TweetDetails from "./TweetDetails";
import { render, screen } from "@testing-library/react";

describe(TweetDetails, () => {
  const tweet = {
    id: 2,
    userName: "Costa",
    date: "12/12/1986",
    description: "This is my first tweet",
  };

  beforeEach(() => {
    render(<TweetDetails tweet={tweet} />);
  });

  it("Should have userName", () => {
    const strong = screen.getByTestId("userName");
    expect(strong).toHaveTextContent(tweet.userName);
  });

  it("Check userName with difrent aprotch", () => {
    const userNameAlt = screen.queryByText(tweet.userName);
    expect(userNameAlt).toBeInTheDocument();
  });

  it("Should have a link for the user", () => {
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/user/${tweet.userId}`);
  });

  it("Should have date", () => {
    const span = screen.getByText(tweet.date);
    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute("title", tweet.date);
  });

  it("Should have tweet description", () => {
    const h3 = screen.getByText(tweet.description);
    expect(h3).toBeInTheDocument();
  });
});
