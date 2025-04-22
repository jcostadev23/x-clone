"use client";

import { ActionsType } from "@/app/helpers/reducer";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useReducerContext } from "@/app/hooks/useReducer";
import { Tweet } from "@/app/types";
import { getAllTweets, tweetLikeUnlike } from "@/app/utils/apiCalls";
import { clsx } from "clsx";
import React from "react";
import ButtonIcon from "../ButtonIcon";
import LikeIcon from "../Icons/LikeIcon";

interface Props {
  tweet: Tweet;
}

const LikeUnlikeButton: React.FC<Props> = ({ tweet }) => {
  const userId = 38;
  const { setIsLoading } = useAppContext();
  const { dispatch } = useReducerContext();
  const liked = tweet.likes.includes(userId);

  const handleClick = async (id?: number) => {
    if (!id) {
      return false;
    }

    setIsLoading(true);
    const resp = await tweetLikeUnlike(id, userId);
    setIsLoading(false);

    if (!resp) {
      return false;
    }

    setIsLoading(true);
    const tweets = await getAllTweets();
    setIsLoading(false);

    if (!tweets) {
      return false;
    }

    dispatch({
      type: ActionsType.SET_TWEETS,
      payload: tweets,
    });
  };

  return (
    <ButtonIcon
      className={clsx("hover:text-red-600", liked && "text-red-600")}
      onClick={() => handleClick(tweet._id)}
      icon={<LikeIcon />}
    >
      {tweet.likes.length}
    </ButtonIcon>
  );
};

export default LikeUnlikeButton;
