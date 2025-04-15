import { Tweet } from "../types";

const url = `${
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
}/tweets/`;

export const getAllTweets = async () => {
  let tweets: { data: Array<Tweet> } = { data: [] };
  try {
    const resp = await fetch(url);
    tweets = await resp.json();
  } catch (error) {
    console.warn("Error on fetch tweets", error);
  }
  return tweets.data;
};

export const postTweet = async (tweet: Tweet) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tweet,
    }),
  });

  const data = await response.json();
  return data.data;
};

export const tweetLikeUnlike = async (tweetId: number, userId: number) => {
  try {
    const response = await fetch(`${url}${tweetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error on put likes", error);
    return false;
  }
};
