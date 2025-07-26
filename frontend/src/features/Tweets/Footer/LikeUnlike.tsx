import { clsx } from "clsx";
import React from "react";
import ButtonIcon from "../../../components/ButtonIcon";
import LikeIcon from "../../../components/Icons/LikeIcon";

interface Props {
  liked: boolean;
  likes: number;
  onLike: () => void;
}

const LikeUnlike: React.FC<Props> = ({ liked, likes, onLike }) => {
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

export default LikeUnlike;
