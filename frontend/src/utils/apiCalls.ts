import { Comment, ListParams, Tweet, User } from "@/types";

const url = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}`;

export const getAllTweets = async (params?: ListParams) => {
  let tweets: { data: Array<Tweet> } = { data: [] };
  try {
    const resp = await fetch(`${url}/tweets?limit=6`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `token=${params?.token}`,
        "Content-Type": "application/json",
      },
    });

    tweets = await resp.json();
  } catch (error) {
    console.warn("Error on fetch tweets", error);
  }
  return tweets.data;
};

export const postTweet = async (tweet: Partial<Tweet>) => {
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

export const tweetLikeUnlike = async (tweetId: string, userId: string) => {
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

export const addComment = async (tweetId: string, comment: Comment) => {
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
  return data;
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

export const getUserById = async (userId: string) => {
  try {
    const response = await fetch(`${url}/users/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const user = await response.json();
    return user.data;
  } catch (error) {
    console.error(`There was an error on geting the user: ${error}`);
  }
};

export const follow = async (userId: string) => {
  try {
    const resp = await fetch(`${url}/users/follow/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await resp.json();

    if (!data) {
      return false;
    }

    return data;
  } catch (error) {
    console.error("Error on Follow user", error);
  }
};

export const getMe = async () => {
  try {
    const resp = await fetch(`${url}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const me = await resp.json();

    return me.user;
  } catch (error) {
    console.log(`There was an error on getting my details: ${error}`);
  }
};
