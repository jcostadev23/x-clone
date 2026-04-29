import Menu from "@/components/Menu";
import Sugestions from "@/components/Sugestions";
import HomeFeed from "@/features/Tweets/HomeFeed";
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
    <div className="min-h-screen bg-white">
      <div className="max-w-[1265px] mx-auto flex">
        <ReducerProvider tweets={tweets}>
          <Menu />

          {/* Main feed */}
          <main className="flex-1 max-w-[600px] border-x border-[#EFF3F4] min-h-screen">
            <HomeFeed initialTweets={tweets} />
          </main>

          <Sugestions />
        </ReducerProvider>
      </div>
    </div>
  );
}
