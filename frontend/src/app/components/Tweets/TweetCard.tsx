import { Tweet } from "@/app/types";
import { formatDate } from "@/app/utils/dateFormater";
import Image from "next/image";
import xIcon from "../../../public/x-icon.jpg";

type Props = {
  tweet: Tweet;
};

const TweetCard: React.FC<Props> = ({ tweet }) => {
  return (
    <div className="flex gap-3 bg-gray-100 hover:bg-gray-200 p-3 border-solid border-1 border-gray-300">
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
          <span className="text-sm" title={formatDate(tweet.date)}>
            {formatDate(tweet.date)}
          </span>
        </div>
        <h3 className="text-sm/7">{tweet.description}</h3>
        <div className="flex gap-2 mt-3 justify-items-center">
          <div>
            {tweet.comments.map((comment) => (
              <p key={comment.id}>{comment.comment}</p>
            ))}
          </div>
          <div>Likes: {tweet.likes.length}</div>
        </div>
      </section>
    </div>
  );
};

export default TweetCard;
