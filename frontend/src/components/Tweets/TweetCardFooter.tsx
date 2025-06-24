import { Tweet } from "@/types";
import Comment from "../PostComment";
import RepostIcon from "../Icons/RepostIcon";
import LikeUnlikeButton from "../TweetButtons/LikeUnlikeButton";
import ViewIcon from "../Icons/ViewIcon";
import BookMarkIcon from "../Icons/BookMarkIcon";
import ShareIcon from "../Icons/ShareIcon";

type Props = {
  tweet: Tweet;
};

const TweetCardFooter: React.FC<Props> = ({ tweet }) => {
  return (
    <div className="flex gap-2 m-3 justify-between max-w-full">
      <Comment tweet={tweet} />
      <div className="flex gap-1.5 items-center text-gray-600 hover:text-emerald-500">
        <RepostIcon />
        123k
      </div>
      <LikeUnlikeButton tweet={tweet} />
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
