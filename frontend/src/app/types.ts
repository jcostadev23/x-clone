type Coment = {
  id: number;
  comment: string;
};

export type Tweet = {
  _id: number;
  userId: number;
  date: string;
  description: string;
  coments: Array<Coment>;
  likes: Array<number>;
};
