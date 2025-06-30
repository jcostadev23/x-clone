import { Comment, Tweet, User } from "@/types";

const url = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}`;

export const getAllTweets = async () => {
  let tweets: { data: Array<Tweet> } = { data: [] };
  try {
    const resp = await fetch(`${url}/tweets`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    tweets = await resp.json();
  } catch (error) {
    console.warn("Error on fetch tweets", error);
  }
  return tweets.data;
};

export const postTweet = async (tweet: Tweet) => {
  const response = await fetch(`${url}/tweets`, {
    method: "POST",
    credentials: "include",
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
    const response = await fetch(`${url}/tweets/${tweetId}`, {
      method: "PUT",
      credentials: "include",
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

export const addComment = async (tweetId: number, comment: Comment) => {
  try {
    const response = await fetch(`${url}/tweets/${tweetId}/comment`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: comment,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error on put Comment", error);
    return false;
  }
};

export const getAllUsers = async () => {
  let users: { data: Array<Record<string, string>> } = { data: [] };
  try {
    const resp = await fetch(`${url}/users/`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    users = await resp.json();
  } catch (error) {
    console.warn("Error on fetch tweets", error);
  }
  return users.data;
};

export const postUser = async (user: User) => {
  const response = await fetch(`${url}/users/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user,
    }),
  });

  const data = await response.json();
  return data.data;
};

export const signIn = async (user: {
  userName: string;
  passwordHash: string;
}) => {
  try {
    const resp = await fetch(`${url}/signin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
      }),
    });
    const data = await resp.json();

    if (!data) {
      return false;
    }

    return data;
  } catch (error) {
    console.error("Error on Sign in", error);
  }
};
