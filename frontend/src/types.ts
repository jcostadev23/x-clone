export type Comment = {
  id: string;
  comment: string;
};

export type Tweet = {
  _id?: string;
  userId: string;
  userName: string;
  date?: string;
  description: string;
  comments: Array<Comment>;
  likes: Array<string>;
  retweets?: Array<string>;
  bookmarkedBy?: Array<string>;
};

export type State = {
  tweets: Array<Tweet>;
};

export type User = {
  _id?: string;
  userName: string;
  email: string;
  birthDate: string;
  password: string;
};

export type ListParams = {
  token?: string;
};

export type Notification = {
  _id: string;
  type: "like" | "retweet" | "follow" | "comment";
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  tweetId?: string;
  read: boolean;
  date: string;
};

export type Message = {
  _id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  text: string;
  read: boolean;
  date: string;
};

export type Conversation = {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageDate: string;
  unread: number;
};

export type ProfileUser = {
  _id: string;
  userName: string;
  email: string;
  birthDate: string;
  createdAt: string;
  follow: string[];
  bio: string;
  profilePicture: string;
  coverPhoto: string;
  followersCount: number;
};
