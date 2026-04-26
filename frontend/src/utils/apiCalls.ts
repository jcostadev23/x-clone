import { Comment, Conversation, ListParams, Message, Notification, ProfileUser, Tweet, User } from "@/types";

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
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    tweets = await resp.json();
  } catch (error) {
    console.warn("Error fetching tweets:", error);
  }
  return tweets.data;
};

export const getUserTweets = async (userId: string) => {
  try {
    const resp = await fetch(`${url}/tweets/user/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data.data as Tweet[];
  } catch (error) {
    console.warn("Error fetching user tweets:", error);
    return [];
  }
};

export const getBookmarkedTweets = async () => {
  try {
    const resp = await fetch(`${url}/tweets/bookmarks`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data.data as Tweet[];
  } catch (error) {
    console.warn("Error fetching bookmarks:", error);
    return [];
  }
};

export const postTweet = async (tweet: Partial<Tweet>) => {
  try {
    const response = await fetch(`${url}/tweets`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tweet }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error posting tweet:", error);
    return null;
  }
};

export const deleteTweet = async (tweetId: string) => {
  try {
    const resp = await fetch(`${url}/tweets/${tweetId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (error) {
    console.error("Error deleting tweet:", error);
    return null;
  }
};

export const tweetLikeUnlike = async (tweetId: string) => {
  try {
    const response = await fetch(`${url}/tweets/${tweetId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error toggling like:", error);
    return null;
  }
};

export const tweetRetweet = async (tweetId: string) => {
  try {
    const resp = await fetch(`${url}/tweets/${tweetId}/retweet`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (error) {
    console.error("Error toggling retweet:", error);
    return null;
  }
};

export const tweetBookmark = async (tweetId: string) => {
  try {
    const resp = await fetch(`${url}/tweets/${tweetId}/bookmark`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return null;
  }
};

export const addComment = async (tweetId: string, comment: Comment) => {
  try {
    const response = await fetch(`${url}/tweets/${tweetId}/comment`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: comment.comment }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error posting comment:", error);
    return null;
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
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    users = await resp.json();
  } catch (error) {
    console.warn("Error fetching users:", error);
  }
  return users.data;
};

export const postUser = async (user: User) => {
  try {
    const response = await fetch(`${url}/users/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const signIn = async (user: { userName: string; password: string }) => {
  try {
    const resp = await fetch(`${url}/signin`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (error) {
    console.error("Error signing in:", error);
    return null;
  }
};

export const getUserById = async (userId: string): Promise<ProfileUser | null> => {
  try {
    const response = await fetch(`${url}/users/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const user = await response.json();
    return user.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateProfile = async (data: { bio?: string; profilePicture?: string; coverPhoto?: string }) => {
  try {
    const resp = await fetch(`${url}/users/me/profile`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    return null;
  }
};

export const searchContent = async (q: string) => {
  try {
    const resp = await fetch(`${url}/search?q=${encodeURIComponent(q)}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json() as { tweets: Tweet[]; users: ProfileUser[] };
  } catch (error) {
    console.error("Error searching:", error);
    return { tweets: [], users: [] };
  }
};

export const follow = async (userId: string) => {
  try {
    const resp = await fetch(`${url}/users/follow/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (error) {
    console.error("Error following user:", error);
    return null;
  }
};

export const unfollow = async (userId: string) => {
  try {
    const resp = await fetch(`${url}/users/unfollow/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return null;
  }
};

export const getMe = async () => {
  try {
    const resp = await fetch(`${url}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) return null;
    const me = await resp.json();
    return me.user;
  } catch (error) {
    console.log("Error fetching current user:", error);
    return null;
  }
};

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const resp = await fetch(`${url}/notifications`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markNotificationsRead = async () => {
  try {
    await fetch(`${url}/notifications/read`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error marking notifications read:", error);
  }
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const resp = await fetch(`${url}/notifications/unread-count`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) return 0;
    const data = await resp.json();
    return data.count;
  } catch {
    return 0;
  }
};

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const resp = await fetch(`${url}/messages/conversations`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export const getMessages = async (userId: string): Promise<Message[]> => {
  try {
    const resp = await fetch(`${url}/messages/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const sendMessage = async (toUserId: string, text: string): Promise<Message | null> => {
  try {
    const resp = await fetch(`${url}/messages`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId, text }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data.data;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};
