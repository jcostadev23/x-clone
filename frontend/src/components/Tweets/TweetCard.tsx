import { Tweet } from "@/types";
import TweetCardFooter from "./TweetCardFooter";
import TweetCardHeader from "./TweetCardHeader";

type Props = {
  tweet: Tweet;
};

const TweetCard: React.FC<Props> = ({ tweet }) => {
  return (
    <div className="flex flex-col gap-3 bg-gray-100 hover:bg-gray-200 p-3 border-solid border-2 border-gray-300 max-w-full">
      <TweetCardHeader tweet={tweet} />
      <TweetCardFooter tweet={tweet} />
    </div>
  );
};

export default TweetCard;
