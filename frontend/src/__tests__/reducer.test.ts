import { describe, it, expect } from "vitest";
import { actions, ActionsType } from "../helpers/reducer";
import { State, Tweet } from "../types";

const makeTweet = (overrides: Partial<Tweet> = {}): Tweet => ({
  _id: "tweet-1",
  userId: "user-1",
  userName: "alice",
  description: "Hello world",
  likes: [],
  comments: [],
  ...overrides,
});

const makeState = (tweets: Tweet[] = []): State => ({ tweets });

// ─── SET_TWEETS ──────────────────────────────────────────────────────────────

describe("SET_TWEETS", () => {
  it("replaces the tweet list", () => {
    const initial = makeState([makeTweet({ _id: "old" })]);
    const newTweets = [makeTweet({ _id: "a" }), makeTweet({ _id: "b" })];
    const next = actions[ActionsType.SET_TWEETS](initial, newTweets);
    expect(next.tweets).toHaveLength(2);
    expect(next.tweets.map((t) => t._id)).toEqual(["a", "b"]);
  });

  it("sets an empty list when given []", () => {
    const initial = makeState([makeTweet()]);
    const next = actions[ActionsType.SET_TWEETS](initial, []);
    expect(next.tweets).toHaveLength(0);
  });

  it("does not mutate the original state", () => {
    const initial = makeState([makeTweet()]);
    actions[ActionsType.SET_TWEETS](initial, []);
    expect(initial.tweets).toHaveLength(1);
  });
});

// ─── LIKE_TWEET (toggle) ─────────────────────────────────────────────────────

describe("LIKE_TWEET", () => {
  it("adds a userId to likes when not already liked", () => {
    const state = makeState([makeTweet({ _id: "tweet-1", likes: [] })]);
    const next = actions[ActionsType.LIKE_TWEET](state, {
      id: "tweet-1",
      userId: "user-1",
    });
    expect(next.tweets[0].likes).toContain("user-1");
  });

  it("removes a userId from likes when already liked (unlike)", () => {
    const state = makeState([
      makeTweet({ _id: "tweet-1", likes: ["user-1", "user-2"] }),
    ]);
    const next = actions[ActionsType.LIKE_TWEET](state, {
      id: "tweet-1",
      userId: "user-1",
    });
    expect(next.tweets[0].likes).not.toContain("user-1");
    expect(next.tweets[0].likes).toContain("user-2");
  });

  it("does not affect other tweets", () => {
    const state = makeState([
      makeTweet({ _id: "tweet-1", likes: [] }),
      makeTweet({ _id: "tweet-2", likes: ["user-1"] }),
    ]);
    const next = actions[ActionsType.LIKE_TWEET](state, {
      id: "tweet-1",
      userId: "user-1",
    });
    expect(next.tweets[1].likes).toContain("user-1");
  });

  it("does nothing when tweet id does not match", () => {
    const state = makeState([makeTweet({ _id: "tweet-1", likes: [] })]);
    const next = actions[ActionsType.LIKE_TWEET](state, {
      id: "no-such-tweet",
      userId: "user-1",
    });
    expect(next.tweets[0].likes).toHaveLength(0);
  });

  it("does not mutate the original state", () => {
    const tweet = makeTweet({ _id: "tweet-1", likes: [] });
    const state = makeState([tweet]);
    actions[ActionsType.LIKE_TWEET](state, { id: "tweet-1", userId: "user-1" });
    expect(tweet.likes).toHaveLength(0);
  });

  it("handles multiple sequential likes from different users", () => {
    let state = makeState([makeTweet({ _id: "tweet-1", likes: [] })]);
    state = actions[ActionsType.LIKE_TWEET](state, {
      id: "tweet-1",
      userId: "user-1",
    });
    state = actions[ActionsType.LIKE_TWEET](state, {
      id: "tweet-1",
      userId: "user-2",
    });
    expect(state.tweets[0].likes).toEqual(["user-1", "user-2"]);
  });
});
