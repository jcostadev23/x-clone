import { render } from "@testing-library/react";
import TweetCard from "./TweetCard";

jest.mock("@/hooks/useAppContext", () => ({
  useAppContext: () => ({
    setIsLoading: jest.fn(),
    user: { userId: "12345" },
  }),
}));

jest.mock("@/hooks/useReducer", () => ({
  useReducerContext: () => ({
    dispatch: jest.fn(),
  }),
}));

jest.mock("./Header", () => ({
  Header: {
    root: ({ children }) => <div data-testid="header-root">{children}</div>,
    avatar: () => <div data-testid="header-avatar" />,
    details: () => <div data-testid="header-details" />,
  },
}));

jest.mock("./Footer", () => {
  const Footer = jest.requireActual("./Footer");
  return { ...Footer };
});

describe("TweetCard snapshot", () => {
  it("renderiza corretamente", () => {
    const fakeTweet = {
      _id: "tweet1",
      userId: "user1",
      likes: ["user2"],
      comments: [{}, {}],
      description: "Um tweet de teste",
      date: "2025-08-10",
    };

    const { container } = render(<TweetCard tweet={fakeTweet} />);
    expect(container).toMatchSnapshot();
  });
});
