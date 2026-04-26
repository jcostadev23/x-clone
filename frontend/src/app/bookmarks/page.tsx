"use client";

import Menu from "@/components/Menu";
import Sugestions from "@/components/Sugestions";
import { useAppContext } from "@/hooks/useAppContext";
import { Tweet } from "@/types";
import { getBookmarkedTweets, tweetBookmark } from "@/utils/apiCalls";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaBookmark, FaRegHeart } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";

export default function BookmarksPage() {
  const { user } = useAppContext();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getBookmarkedTweets();
      setTweets(data);
      setLoading(false);
    })();
  }, []);

  const handleRemoveBookmark = useCallback(async (tweetId: string) => {
    await tweetBookmark(tweetId);
    setTweets((prev) => prev.filter((t) => t._id !== tweetId));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1265px] mx-auto flex">
        <Menu />

        <main className="flex-1 max-w-[600px] border-x border-[#EFF3F4] min-h-screen">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md px-4 py-3 border-b border-[#EFF3F4]">
            <h2 className="text-[20px] font-bold text-[#0F1419]">Bookmarks</h2>
            {user?.userName && (
              <p className="text-[13px] text-[#536471]">@{user.userName}</p>
            )}
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && tweets.length === 0 && (
            <div className="px-8 py-12 flex flex-col items-center text-center">
              <FaBookmark size={48} className="text-[#1D9BF0] mb-4" />
              <h2 className="text-[23px] font-extrabold text-[#0F1419] mb-2">Save posts for later</h2>
              <p className="text-[#536471] text-[15px]">Don&apos;t let the good ones fly away! Bookmark posts to easily find them again in the future.</p>
            </div>
          )}

          {!loading && tweets.map((tweet) => (
            <article key={tweet._id} className="border-b border-[#EFF3F4] px-4 py-3 hover:bg-black/[0.02] transition-colors">
              <div className="flex gap-3">
                <Link href={`/user/${tweet.userId}`}>
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {tweet.userName?.[0]?.toUpperCase()}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <Link href={`/user/${tweet.userId}`} className="font-bold text-[15px] text-[#0F1419] hover:underline">
                      {tweet.userName}
                    </Link>
                    <span className="text-[#536471] text-[15px]">· {tweet.date}</span>
                    <button
                      className="ml-auto p-1.5 rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] text-[#1D9BF0] transition-colors"
                      onClick={() => tweet._id && handleRemoveBookmark(tweet._id)}
                      title="Remove bookmark"
                    >
                      <FaBookmark size={16} />
                    </button>
                  </div>
                  <p className="text-[15px] text-[#0F1419] mt-0.5 break-words whitespace-pre-wrap">{tweet.description}</p>
                  <div className="flex items-center gap-6 mt-2 text-[#536471] text-[13px]">
                    <span className="flex items-center gap-1"><FaRegComment size={14} />{tweet.comments.length || ""}</span>
                    <span className="flex items-center gap-1"><BiRepost size={16} />{tweet.retweets?.length || ""}</span>
                    <span className="flex items-center gap-1"><FaRegHeart size={14} />{tweet.likes.length || ""}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </main>

        <Sugestions />
      </div>
    </div>
  );
}
