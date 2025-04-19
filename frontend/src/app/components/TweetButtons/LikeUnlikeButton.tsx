"use client";

import { useAppContext } from "@/app/hooks/useAppContext";
import { Tweet } from "@/app/types";
import { tweetLikeUnlike } from "@/app/utils/apiCalls";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import React from "react";
import ButtonIcon from "../ButtonIcon";
import LikeIcon from "../Icons/LikeIcon";

interface Props {
  tweet: Tweet;
}

const LikeUnlikeButton: React.FC<Props> = ({ tweet }) => {
  const userId = 38;
  const router = useRouter();
  const { setIsLoading } = useAppContext();
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

    router.refresh();
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
