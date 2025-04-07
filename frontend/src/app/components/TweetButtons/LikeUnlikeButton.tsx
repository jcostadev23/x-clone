"use client";

import { clsx } from "clsx";
import { tweetLikeUnlike } from "@/app/utils/apiCalls";
import LikeIcon from "../LikeIcon";
import { Tweet } from "@/app/types";
import React from "react";

interface Props {
  tweet: Tweet;
}

const LikeUnlikeButton: React.FC<Props> = ({ tweet }) => {
  const userId = 38;
  const liked = tweet.likes.includes(userId);

  const handleClick = async (id?: number) => {
    if (!id) {
      return false;
    }

    const resp = await tweetLikeUnlike(id, userId);
    if (!resp) {
      return false;
    }
  };

  return (
    <button
      type="button"
      className={clsx(
        "flex gap-1.5 items-center text-gray-600 hover:text-red-600",
        liked && "text-red-600"
      )}
      onClick={() => handleClick(tweet._id)}
    >
      <LikeIcon /> {tweet.likes.length}
    </button>
  );
};

export default LikeUnlikeButton;
