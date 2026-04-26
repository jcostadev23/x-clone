"use client";

import Menu from "@/components/Menu";
import Sugestions from "@/components/Sugestions";
import { ProfileUser, Tweet } from "@/types";
import { searchContent } from "@/utils/apiCalls";
import Link from "next/link";
import { useCallback, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [users, setUsers] = useState<ProfileUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [tab, setTab] = useState<"tweets" | "users">("tweets");

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const results = await searchContent(query.trim());
    setTweets(results.tweets ?? []);
    setUsers(results.users ?? []);
    setSearched(true);
    setLoading(false);
  }, [query]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1265px] mx-auto flex">
        <Menu />

        <main className="flex-1 max-w-[600px] border-x border-[#EFF3F4] min-h-screen">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md px-4 py-3 border-b border-[#EFF3F4]">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center gap-3 bg-[#EFF3F4] rounded-full px-4 py-2.5">
                <HiOutlineSearch size={20} className="text-[#536471] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-[#0F1419] placeholder-[#536471] text-[15px] outline-none"
                />
              </div>
            </form>
          </div>

          {/* Tabs (only shown after search) */}
          {searched && (
            <div className="flex border-b border-[#EFF3F4]">
              {(["tweets", "users"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-4 text-[15px] capitalize relative hover:bg-[#E7E7E8] transition-colors ${
                    tab === t ? "font-bold text-[#0F1419]" : "font-medium text-[#536471]"
                  }`}
                >
                  {t}
                  {tab === t && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1D9BF0] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Results */}
          {!loading && searched && tab === "tweets" && (
            <>
              {tweets.length === 0 ? (
                <div className="px-8 py-12 text-center">
                  <h2 className="text-[23px] font-extrabold text-[#0F1419] mb-2">No results for "{query}"</h2>
                  <p className="text-[#536471] text-[15px]">Try different keywords or check your spelling.</p>
                </div>
              ) : (
                tweets.map((tweet) => (
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
                        </div>
                        <p className="text-[15px] text-[#0F1419] mt-0.5 break-words">{tweet.description}</p>
                        <div className="flex items-center gap-6 mt-2 text-[#536471] text-[13px]">
                          <span className="flex items-center gap-1"><FaRegComment size={14} />{tweet.comments.length || ""}</span>
                          <span className="flex items-center gap-1"><BiRepost size={16} />{tweet.retweets?.length || ""}</span>
                          <span className="flex items-center gap-1"><FaRegHeart size={14} />{tweet.likes.length || ""}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </>
          )}

          {!loading && searched && tab === "users" && (
            <>
              {users.length === 0 ? (
                <div className="px-8 py-12 text-center">
                  <h2 className="text-[23px] font-extrabold text-[#0F1419] mb-2">No users found for "{query}"</h2>
                </div>
              ) : (
                users.map((u) => (
                  <Link key={u._id} href={`/user/${u._id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F9F9] transition-colors border-b border-[#EFF3F4]">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {u.userName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[15px] text-[#0F1419]">{u.userName}</p>
                      <p className="text-[#536471] text-[15px]">@{u.userName}</p>
                      {u.bio && <p className="text-[#0F1419] text-[14px] mt-0.5">{u.bio}</p>}
                    </div>
                  </Link>
                ))
              )}
            </>
          )}

          {/* Empty state before search */}
          {!searched && !loading && (
            <div className="px-8 py-12 text-center">
              <h2 className="text-[23px] font-extrabold text-[#0F1419] mb-2">Search X</h2>
              <p className="text-[#536471] text-[15px]">Try searching for people, topics, or keywords</p>
            </div>
          )}
        </main>

        <Sugestions />
      </div>
    </div>
  );
}
