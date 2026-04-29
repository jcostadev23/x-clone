"use client";

import PostTweet from "./components/PostTweet";
import Tweets from ".";
import { Tweet } from "@/types";
import { getFollowingTweets } from "@/utils/apiCalls";
import { useReducerContext } from "@/hooks/useReducer";
import { ActionsType } from "@/helpers/reducer";
import { useState, useEffect } from "react";
import { HiOutlineSparkles } from "react-icons/hi";

type Props = {
  initialTweets: Tweet[];
};

const HomeFeed: React.FC<Props> = ({ initialTweets }) => {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");
  const [followingTweets, setFollowingTweets] = useState<Tweet[] | null>(null);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { dispatch, state } = useReducerContext();

  useEffect(() => {
    setMounted(true);
    dispatch({ type: ActionsType.SET_TWEETS, payload: initialTweets });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchToFollowing = async () => {
    if (activeTab === "following") return;
    setActiveTab("following");
    if (followingTweets === null) {
      setLoadingFollowing(true);
      const tweets = await getFollowingTweets();
      setFollowingTweets(tweets);
      setLoadingFollowing(false);
    }
  };

  const switchToForYou = () => {
    if (activeTab === "for-you") return;
    setActiveTab("for-you");
  };

  // Use initialTweets for SSR and first paint; switch to reducer state after mount
  const forYouTweets = mounted && state.tweets.length > 0 ? state.tweets : initialTweets;
  const displayedTweets = activeTab === "following" ? (followingTweets ?? []) : forYouTweets;

  return (
    <>
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
          <button
            className="flex-1 py-4 text-center text-[15px] transition-colors hover:bg-[#E7E7E8] relative"
            onClick={switchToForYou}
          >
            <span className={activeTab === "for-you" ? "font-bold text-[#0F1419]" : "font-medium text-[#536471]"}>
              For you
            </span>
            {activeTab === "for-you" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1D9BF0] rounded-full" />
            )}
          </button>
          <button
            className="flex-1 py-4 text-center text-[15px] transition-colors hover:bg-[#E7E7E8] relative"
            onClick={switchToFollowing}
          >
            <span className={activeTab === "following" ? "font-bold text-[#0F1419]" : "font-medium text-[#536471]"}>
              Following
            </span>
            {activeTab === "following" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1D9BF0] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Compose */}
      <PostTweet />

      {/* Divider */}
      <div className="border-t border-[#EFF3F4]" />

      {/* Tweet feed */}
      {loadingFollowing ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeTab === "following" && displayedTweets.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <h3 className="text-[20px] font-extrabold text-[#0F1419] mb-2">Follow people to see their posts here</h3>
          <p className="text-[#536471] text-[15px]">When you follow someone, their posts will show up here.</p>
        </div>
      ) : (
        <Tweets tweets={displayedTweets} />
      )}
    </>
  );
};

export default HomeFeed;
