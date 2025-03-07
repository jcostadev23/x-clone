type Coment = {
  id: number;
  comment: string;
};

export type Tweet = {
  _id: number;
  userId: number;
  userName: string;
  date: string;
  description: string;
  comments: Array<Coment>;
  likes: Array<number>;
};
