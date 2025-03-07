import { Tweet } from "./types";
import TweetCard from "./components/Tweets/TweetCard";
import PostTweet from "./components/Form/PostTweet";
import Menu from "./components/Menu";
import Sugestions from "./components/Sugestions/RhsSugestions";
import ShowMorePosts from "./components/ShowMorePosts";

export default async function Home() {
  const tweets: Array<Tweet> = await fetch("http://localhost:4000/tweets")
    .then((resp) => resp.json())
    .then((data) => data.data);

  return (
    <div className="flex flex-col gap-6 p-5 md:flex-row md:gap-8 bg-gray-50 dark:bg-gray-800">
      <Menu />
      <div className="flex-[4] container mx-auto border border-gray-300">
        <PostTweet />
        <ShowMorePosts />
        {tweets.map((tweet) => (
          <TweetCard key={tweet._id} tweet={tweet} />
        ))}
      </div>
      <Sugestions />
    </div>
  );
}
