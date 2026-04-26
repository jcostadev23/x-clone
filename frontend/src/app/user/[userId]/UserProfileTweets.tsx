"use client";

import { Tweet } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";

type Props = {
  tweets: Tweet[];
  userName: string;
};

const UserProfileTweets: React.FC<Props> = ({ tweets, userName }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Posts", "Replies", "Media", "Likes"];

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b border-[#EFF3F4]">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-4 text-[15px] font-medium text-[#536471] hover:bg-[#E7E7E8] transition-colors relative ${
              activeTab === i ? "text-[#0F1419] font-bold" : ""
            }`}
          >
            {tab}
            {activeTab === i && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1D9BF0] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Posts tab */}
      {activeTab === 0 && (
        <>
          {tweets.length === 0 ? (
            <div className="flex flex-col items-center px-8 pt-12">
              <h2 className="text-[31px] font-extrabold text-[#0F1419] mb-2">No posts yet</h2>
              <p className="text-[15px] text-[#536471] text-center">
                When {userName} posts, their posts will show up here.
              </p>
            </div>
          ) : (
            tweets.map((tweet) => (
              <article key={tweet._id} className="border-b border-[#EFF3F4] px-4 py-3 hover:bg-black/[0.02] transition-colors">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {tweet.userName?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-bold text-[15px] text-[#0F1419]">{tweet.userName}</span>
                      <span className="text-[#536471] text-[15px]">· {tweet.date}</span>
                    </div>
                    <p className="text-[15px] text-[#0F1419] mt-0.5 break-words whitespace-pre-wrap">{tweet.description}</p>
                    <div className="flex items-center gap-6 mt-2 text-[#536471] text-[13px]">
                      <span className="flex items-center gap-1.5"><FaRegComment size={14} />{tweet.comments.length || ""}</span>
                      <span className="flex items-center gap-1.5"><BiRepost size={16} />{tweet.retweets?.length || ""}</span>
                      <span className="flex items-center gap-1.5"><FaRegHeart size={14} />{tweet.likes.length || ""}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </>
      )}

      {/* Other tabs — empty state */}
      {activeTab !== 0 && (
        <div className="flex flex-col items-center px-8 pt-12">
          <h2 className="text-[31px] font-extrabold text-[#0F1419] mb-2">Nothing to see here</h2>
          <p className="text-[15px] text-[#536471] text-center">
            {userName} hasn&apos;t posted any {tabs[activeTab].toLowerCase()} yet.
          </p>
        </div>
      )}
    </>
  );
};

export default UserProfileTweets;
