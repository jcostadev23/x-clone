export type Comment = {
  id: number;
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
};

export type State = {
  tweets: Array<Tweet>;
};

export type User = {
  _id?: string;
  userName: string;
  email: string;
  birthDate: string;
  passwordHash: string;
};
