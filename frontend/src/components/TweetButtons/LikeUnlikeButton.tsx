import { clsx } from "clsx";
import React from "react";
import ButtonIcon from "../ButtonIcon";
import LikeIcon from "../Icons/LikeIcon";

interface Props {
  liked: boolean;
  likes: number;
  onLike: () => void;
}

const LikeUnlikeButton: React.FC<Props> = ({ liked, likes, onLike }) => {
  return (
    <ButtonIcon
      className={clsx("hover:text-red-600", liked && "text-red-600")}
      onClick={onLike}
      icon={<LikeIcon />}
    >
      {likes}
    </ButtonIcon>
  );
};

export default LikeUnlikeButton;
