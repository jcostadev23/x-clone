import Menu from "@/components/Menu";
import Sugestions from "@/components/Sugestions";
import PostTweet from "@/features/Tweets/components/PostTweet";
import Tweets from "@/features/Tweets";
import { ReducerProvider } from "@/hooks/useReducer";
import { getAllTweets } from "@/utils/apiCalls";
import { HiOutlineSparkles } from "react-icons/hi";
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
    <div className="min-h-screen bg-white">
      <div className="max-w-[1265px] mx-auto flex">
        <ReducerProvider tweets={tweets}>
          <Menu />

          {/* Main feed */}
          <main className="flex-1 max-w-[600px] border-x border-[#EFF3F4] min-h-screen">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-[20px] font-bold text-[#0F1419]">Home</h2>
                <button className="p-2 rounded-full hover:bg-[#E7E7E8] transition-colors text-[#0F1419]">
                  <HiOutlineSparkles size={20} />
                </button>
              </div>
              {/* For you / Following tabs */}
              <div className="flex border-b border-[#EFF3F4]">
                <button className="flex-1 py-4 text-center text-[15px] font-bold text-[#0F1419] relative hover:bg-[#E7E7E8] transition-colors">
                  For you
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1D9BF0] rounded-full" />
                </button>
                <button className="flex-1 py-4 text-center text-[15px] font-medium text-[#536471] hover:bg-[#E7E7E8] transition-colors">
                  Following
                </button>
              </div>
            </div>

            {/* Compose */}
            <PostTweet />

            {/* Divider */}
            <div className="border-t border-[#EFF3F4]" />

            {/* Tweet feed */}
            <Tweets tweets={tweets} />
          </main>

          <Sugestions />
        </ReducerProvider>
      </div>
    </div>
  );
}
