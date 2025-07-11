import { Tweet } from "@/types";
import TweetCard from "./TweetCard";

type Props = {
  tweets: Array<Tweet>;
};

const Tweets = async ({ tweets }: Props) => {
  return (
    <>
      {tweets?.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
    </>
  );
};

export default Tweets;
