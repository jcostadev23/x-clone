"use client";

import { fetchAndSetTweets } from "@/helpers";
import { useAppContext } from "@/hooks/useAppContext";
import { useReducerContext } from "@/hooks/useReducer";
import { postTweet } from "@/utils/apiCalls";
import { useState } from "react";
import {
  HiOutlinePhotograph,
  HiOutlineEmojiHappy,
  HiOutlineGlobe,
} from "react-icons/hi";
import { MdGif, MdBarChart } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";

const PostTweet = () => {
  const [tweet, setTweet] = useState("");
  const { startLoading, stopLoading, user } = useAppContext();
  const { dispatch } = useReducerContext();
  const initial = user?.userName?.[0]?.toUpperCase() ?? "?";
  const charLimit = 280;
  const remaining = charLimit - tweet.length;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining <= 20 && remaining >= 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweet.trim() || isOverLimit) return;
    startLoading();
    const response = await postTweet({ description: tweet.trim(), comments: [], likes: [] });
    if (response) {
      setTweet("");
      await fetchAndSetTweets(startLoading, stopLoading, dispatch);
    }
    stopLoading();
  };

  return (
    <form onSubmit={onSubmit} className="px-4 pt-3 pb-1 border-b border-[#EFF3F4]">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
          {initial}
        </div>

        {/* Input area */}
        <div className="flex-1 min-w-0">
          <textarea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder="What is happening?!"
            rows={2}
            className="w-full text-[20px] text-[#0F1419] placeholder-[#536471] outline-none bg-transparent mt-2 min-h-[56px] leading-normal"
          />

          {/* "Everyone can reply" row */}
          {tweet.length > 0 && (
            <div className="flex items-center gap-1 text-[#1D9BF0] text-[14px] font-semibold mb-2 cursor-pointer hover:underline w-fit">
              <HiOutlineGlobe size={16} />
              <span>Everyone can reply</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-[#EFF3F4] pt-3 mt-1 flex items-center justify-between">
            {/* Media action buttons */}
            <div className="flex items-center gap-0.5 text-[#1D9BF0]">
              <button type="button" className="p-2 rounded-full hover:bg-[#1D9BF0]/10 transition-colors" title="Media">
                <HiOutlinePhotograph size={20} />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-[#1D9BF0]/10 transition-colors" title="GIF">
                <MdGif size={22} />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-[#1D9BF0]/10 transition-colors" title="Poll">
                <MdBarChart size={20} />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-[#1D9BF0]/10 transition-colors" title="Emoji">
                <HiOutlineEmojiHappy size={20} />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-[#1D9BF0]/10 transition-colors" title="Schedule">
                <RiCalendarScheduleLine size={20} />
              </button>
            </div>

            {/* Right: character counter + post button */}
            <div className="flex items-center gap-3">
              {tweet.length > 0 && (
                <span
                  className={`text-[14px] ${
                    isOverLimit
                      ? "text-rose-500 font-bold"
                      : isNearLimit
                      ? "text-yellow-500"
                      : "text-[#536471]"
                  }`}
                >
                  {remaining}
                </span>
              )}
              <button
                type="submit"
                disabled={!tweet.trim() || isOverLimit}
                className="bg-[#1D9BF0] hover:bg-[#1A8CD8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[15px] font-bold rounded-full px-4 py-1.5 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostTweet;
