"use client";

import { ActionsType } from "@/helpers/reducer";
import { useAppContext } from "@/hooks/useAppContext";
import { Action, useReducerContext } from "@/hooks/useReducer";
import { Tweet } from "@/types";
import { addComment, getAllTweets, tweetLikeUnlike } from "@/utils/apiCalls";
import { useState } from "react";
import BookMarkIcon from "../Icons/BookMarkIcon";
import RepostIcon from "../Icons/RepostIcon";
import ShareIcon from "../Icons/ShareIcon";
import ViewIcon from "../Icons/ViewIcon";
import Comment from "../PostComment";
import LikeUnlikeButton from "../TweetButtons/LikeUnlikeButton";

type Props = {
  tweet: Tweet;
};

const fetchAndSetTweets = async (
  setIsLoading: (loading: boolean) => void,
  dispatch: React.Dispatch<Action>
) => {
  setIsLoading(true);
  const tweets = await getAllTweets();
  setIsLoading(false);

  if (tweets) {
    dispatch({
      type: ActionsType.SET_TWEETS,
      payload: tweets,
    });
  }
};

const TweetCardFooter: React.FC<Props> = ({ tweet }) => {
  const { setIsLoading, user } = useAppContext();
  const { dispatch } = useReducerContext();
  const [formState, setFormState] = useState({
    isOpen: false,
    comment: "",
  });

  const liked = tweet.likes.includes(user?.userId as string);

  const handleLikeUnlikeClick = async () => {
    if (!tweet._id || !user?.userId) {
      return false;
    }

    setIsLoading(true);
    const resp = await tweetLikeUnlike(tweet._id, user.userId);
    setIsLoading(false);

    if (!resp) {
      return false;
    }

    await fetchAndSetTweets(setIsLoading, dispatch);
  };

  const handleComment = async () => {
    if (!formState.comment || !tweet._id) {
      return false;
    }

    setIsLoading(true);
    const response = await addComment(tweet._id, {
      id: tweet.userId,
      comment: formState.comment,
    });
    setIsLoading(false);

    if (!response) {
      return false;
    }

    await fetchAndSetTweets(setIsLoading, dispatch);
  };

  return (
    <div
      data-cy="TweetCardFooter"
      className="flex gap-2 m-3 justify-between max-w-full"
    >
      <Comment
        form={formState}
        setForm={setFormState}
        commentsAmount={tweet.comments.length}
        onSubmit={handleComment}
      />
      <div className="flex gap-1.5 items-center text-gray-600 hover:text-emerald-500">
        <RepostIcon />
        123k
      </div>
      <LikeUnlikeButton
        liked={liked}
        likes={tweet.likes.length}
        onLike={handleLikeUnlikeClick}
      />
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
