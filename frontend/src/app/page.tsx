import Menu from "@/components/Menu";
import PostTweet from "@/features/Tweets/components/PostTweet";
import MoreTweets from "@/features/Tweets/MoreTweets";
import Sugestions from "@/components/Sugestions";
import Tweets from "@/features/Tweets";
import { ReducerProvider } from "@/hooks/useReducer";
import { getAllTweets } from "@/utils/apiCalls";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/signin");
  }

  const tweets = await getAllTweets({ token });

  return (
    <div className="flex flex-col gap-6 p-5 md:flex-row md:gap-8">
      <ReducerProvider tweets={tweets}>
        <Menu />
        <div className="flex-[4] container mx-auto border border-gray-300">
          <PostTweet />
          <MoreTweets />
          <Tweets tweets={tweets} />
        </div>
        <Sugestions />
      </ReducerProvider>
    </div>
  );
}
