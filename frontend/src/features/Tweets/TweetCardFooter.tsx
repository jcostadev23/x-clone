"use client";

import BookMarkIcon from "../../components/Icons/BookMarkIcon";
import RepostIcon from "../../components/Icons/RepostIcon";
import ShareIcon from "../../components/Icons/ShareIcon";
import ViewIcon from "../../components/Icons/ViewIcon";
import Comment from "./Comment";
import LikeUnlikeButton from "./components/LikeUnlikeButton";

interface FormState {
  isOpen: boolean;
  comment: string;
}

interface Props {
  form: FormState;
  liked: boolean;
  likes: number;
  onLike: () => void;
  onSubmit: () => void;
  commentsAmount: number;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

const TweetCardFooter: React.FC<Props> = ({
  liked,
  likes,
  onLike,
  onSubmit,
  commentsAmount,
  form,
  setForm,
}) => {
  return (
    <div
      data-cy="TweetCardFooter"
      className="flex gap-2 m-3 justify-between max-w-full"
    >
      <Comment
        form={form}
        setForm={setForm}
        commentsAmount={commentsAmount}
        onSubmit={onSubmit}
      />
      <div className="flex gap-1.5 items-center text-gray-600 hover:text-emerald-500">
        <RepostIcon />
        123k
      </div>
      <LikeUnlikeButton liked={liked} likes={likes} onLike={onLike} />
      <div className="flex gap-1.5 items-center text-gray-600 hover:text-blue-500">
        <ViewIcon /> 4.5m
      </div>
      <div className="flex gap-3 items-center">
        <BookMarkIcon />
        <ShareIcon />
      </div>
    </div>
  );
};

export default TweetCardFooter;
