import { Tweet } from "../types";

const url = "http://localhost:4000/tweets/";

export const getAllTweets = async () => {
  return await fetch(url)
    .then((resp) => resp.json())
    .then((data) => data.data);
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
