import Menu from "@/components/Menu";
import PostTweet from "@/components/PostTweet";
import ShowMorePosts from "@/components/ShowMorePosts";
import Sugestions from "@/components/Sugestions/RhsSugestions";
import Tweets from "@/components/Tweets";
import { ReducerProvider } from "@/hooks/useReducer";

export default async function Home() {
  return (
    <div className="flex flex-col gap-6 p-5 md:flex-row md:gap-8 bg-gray-50 dark:bg-gray-800">
      <ReducerProvider>
        <Menu />
        <div className="flex-[4] container mx-auto border border-gray-300">
          <PostTweet />
          <ShowMorePosts />
          <Tweets />
        </div>
        <Sugestions />
      </ReducerProvider>
    </div>
  );
}
