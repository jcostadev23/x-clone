import { State, Tweet } from "@/types";

export enum ActionsType {
  SET_TWEETS = "SET_TWEETS",
  LIKE_TWEET = "LIKE_TWEET",
}

const setTweets = (state: State, payload: Array<Tweet>) => ({
  ...state,
  tweets: payload,
});

const setLike = (state: State, payload: { id: number; userId: number }) => ({
  ...state,
  tweets: state.tweets.map((tweet) =>
    tweet._id === payload.id
      ? { ...tweet, likes: [...tweet.likes, payload.userId] }
      : tweet
  ),
});

export const actions = {
  [ActionsType.SET_TWEETS]: setTweets,
  [ActionsType.LIKE_TWEET]: setLike,
};
