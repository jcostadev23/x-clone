import { Tweet } from "@/app/types";
import { formatDate } from "@/app/utils/dateFormater";
import Image from "next/image";
import xIcon from "../../../public/x-icon.jpg";
import LikeIcon from "../LikeIcon";
import CommentIcon from "../CommentIcon";
import RepostIcon from "../RepostIcon";
import ViewIcon from "../ViewIcon";
import BookMarkIcon from "../BookMarkIcon";
import ShareIcon from "../ShareIcon";

type Props = {
  tweet: Tweet;
};

const TweetCard: React.FC<Props> = ({ tweet }) => {
  return (
    <div className="flex flex-col gap-3 bg-gray-100 hover:bg-gray-200 p-3 border-solid border-2 border-gray-300 max-w-full">
      <div className="flex gap-3">
        <div>
          <Image
            className="rounded-xl"
            src={xIcon}
            alt={"X image"}
            width={26}
            height={26}
          />
        </div>
        <section>
          <div className="flex gap-2">
            <strong className="text-black text-md">{tweet.userName}</strong>
            <span
              className="text-sm"
              title={tweet?.date ? formatDate(tweet?.date) : "-"}
            >
              {tweet?.date ? formatDate(tweet?.date) : "-"}
            </span>
          </div>
          <h3 className="text-sm/7">{tweet.description}</h3>
        </section>
      </div>
      <div className="flex gap-2 m-3 justify-between max-w-full">
        <div className="flex gap-1.5 items-center text-gray-600 hover:text-blue-500">
          <CommentIcon /> {tweet.comments.length}
        </div>
        <div className="flex gap-1.5 items-center text-gray-600 hover:text-emerald-500">
          <RepostIcon />
          123k
        </div>
        <div className="flex gap-1.5 items-center text-gray-600 hover:text-red-600">
          <LikeIcon /> {tweet.likes.length}
        </div>
        <div className="flex gap-1.5 items-center text-gray-600 hover:text-blue-500">
          <ViewIcon /> 4.5m
        </div>
        <div className="flex gap-3 items-center">
          <BookMarkIcon />
          <ShareIcon />
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
