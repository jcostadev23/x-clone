import PostTweet from "./components/Form/PostTweet";
import Menu from "./components/Menu";
import ShowMorePosts from "./components/ShowMorePosts";
import Sugestions from "./components/Sugestions/RhsSugestions";
import TweetCard from "./components/Tweets/TweetCard";
import { AppProvider } from "./hooks/useAppContext";
import { Tweet } from "./types";
import { getAllTweets } from "./utils/apiCalls";

export default async function Home() {
  const tweets: Array<Tweet> = await getAllTweets();

  return (
    <div className="flex flex-col gap-6 p-5 md:flex-row md:gap-8 bg-gray-50 dark:bg-gray-800">
      <AppProvider>
        <Menu />
        <div className="flex-[4] container mx-auto border border-gray-300">
          <PostTweet />
          <ShowMorePosts />
          {tweets.map((tweet) => (
            <TweetCard key={tweet._id} tweet={tweet} />
          ))}
        </div>
        <Sugestions />
      </AppProvider>
    </div>
  );
}
