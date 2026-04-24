import { State, Tweet } from "@/types";

export enum ActionsType {
  SET_TWEETS = "SET_TWEETS",
  LIKE_TWEET = "LIKE_TWEET",
}

const setTweets = (state: State, payload: Array<Tweet>) => ({
  ...state,
  tweets: payload,
});

const toggleLike = (state: State, payload: { id: string; userId: string }) => ({
  ...state,
  tweets: state.tweets.map((tweet) => {
    if (tweet._id !== payload.id) return tweet;
    const alreadyLiked = tweet.likes.includes(payload.userId);
    return {
      ...tweet,
      likes: alreadyLiked
        ? tweet.likes.filter((id) => id !== payload.userId)
        : [...tweet.likes, payload.userId],
    };
  }),
});

export const actions = {
  [ActionsType.SET_TWEETS]: setTweets,
  [ActionsType.LIKE_TWEET]: toggleLike,
};
