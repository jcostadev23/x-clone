import { Tweet } from "@/types";
import Link from "next/link";

interface Props {
  tweet: Tweet;
}

const TweetDetails: React.FC<Props> = ({ tweet }) => {
  const { userId, userName, date, description } = tweet || {};
  return (
    <section>
      <div className="flex gap-2">
        <Link href={`/user/${userId}`}>
          <strong className="text-black text-md">{userName}</strong>
        </Link>
        <span className="text-sm" title={date}>
          {date}
        </span>
      </div>
      <h3 className="text-sm/7">{description}</h3>
    </section>
  );
};

export default TweetDetails;
