export type Comment = {
  id: number;
  comment: string;
};

export type Tweet = {
  _id?: number;
  userId: number;
  userName: string;
  date?: string;
  description: string;
  comments: Array<Comment>;
  likes: Array<number>;
};

export type State = {
  tweets: Array<Tweet>;
};

export type User = {
  _id?: number;
  userName: string;
  email: string;
  birthDate: string;
  passwordHash: string;
};
