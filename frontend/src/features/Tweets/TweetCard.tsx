"use client";

import { fetchAndSetTweets } from "@/helpers";
import { useAppContext } from "@/hooks/useAppContext";
import { useReducerContext } from "@/hooks/useReducer";
import { Tweet } from "@/types";
import { addComment, tweetLikeUnlike } from "@/utils/apiCalls";
import { useCallback, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaRegBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { IoMdStats } from "react-icons/io";
import { RiShare2Line } from "react-icons/ri";
import Link from "next/link";
import CommentForm from "./components/CommentForm";

type Props = { tweet: Tweet };

const TweetCard: React.FC<Props> = ({ tweet }) => {
  const { startLoading, stopLoading, user } = useAppContext();
  const { dispatch } = useReducerContext();
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");

  const liked = tweet.likes.includes(user?.userId as string);
  const initial = tweet.userName?.[0]?.toUpperCase() ?? "?";

  const handleLike = useCallback(async () => {
    if (!tweet._id) return;
    startLoading();
    await tweetLikeUnlike(tweet._id);
    await fetchAndSetTweets(startLoading, stopLoading, dispatch);
    stopLoading();
  }, [dispatch, startLoading, stopLoading, tweet._id]);

  const handleComment = useCallback(async () => {
    if (!comment.trim() || !tweet._id) return;
    startLoading();
    await addComment(tweet._id, { id: tweet.userId, comment });
    setComment("");
    setCommentOpen(false);
    await fetchAndSetTweets(startLoading, stopLoading, dispatch);
    stopLoading();
  }, [comment, dispatch, startLoading, stopLoading, tweet._id, tweet.userId]);

  return (
    <article className="border-b border-[#EFF3F4] px-4 py-3 hover:bg-black/[0.02] cursor-pointer transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/user/${tweet.userId}`} onClick={(e) => e.stopPropagation()}>
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 hover:opacity-90 transition-opacity">
            {initial}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1 flex-wrap pr-2">
            <Link
              href={`/user/${tweet.userId}`}
              className="font-bold text-[15px] text-[#0F1419] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {tweet.userName}
            </Link>
            <span className="text-[#536471] text-[15px]">@{tweet.userName}</span>
            <span className="text-[#536471] text-[15px]">·</span>
            <span className="text-[#536471] text-[15px]">{tweet.date}</span>
            <button
              className="ml-auto p-1.5 rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] text-[#536471] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <BsThreeDots size={16} />
            </button>
          </div>

          {/* Tweet text */}
          <p className="text-[15px] text-[#0F1419] mt-0.5 leading-normal break-words whitespace-pre-wrap">
            {tweet.description}
          </p>

          {/* Action row */}
          <div className="flex items-center justify-between mt-3 -ml-2 max-w-[425px] text-[#536471]">
            {/* Comment */}
            <button
              className="group flex items-center gap-1"
              onClick={(e) => { e.stopPropagation(); setCommentOpen(true); }}
            >
              <span className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] transition-colors">
                <FaRegComment size={16} />
              </span>
              <span className="text-[13px] group-hover:text-[#1D9BF0]">
                {tweet.comments.length > 0 ? tweet.comments.length : ""}
              </span>
            </button>

            {/* Repost */}
            <button className="group flex items-center gap-1">
              <span className="p-2 rounded-full group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                <BiRepost size={20} />
              </span>
              <span className="text-[13px] group-hover:text-emerald-500" />
            </button>

            {/* Like */}
            <button
              className="group flex items-center gap-1"
              onClick={(e) => { e.stopPropagation(); handleLike(); }}
            >
              <span className={`p-2 rounded-full group-hover:bg-rose-500/10 group-hover:text-rose-500 transition-colors ${liked ? "text-rose-500" : ""}`}>
                {liked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              </span>
              <span className={`text-[13px] group-hover:text-rose-500 ${liked ? "text-rose-500" : ""}`}>
                {tweet.likes.length > 0 ? tweet.likes.length : ""}
              </span>
            </button>

            {/* Views */}
            <button className="group flex items-center gap-1">
              <span className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] transition-colors">
                <IoMdStats size={18} />
              </span>
              <span className="text-[13px] group-hover:text-[#1D9BF0]" />
            </button>

            {/* Bookmark + Share */}
            <div className="flex items-center">
              <button
                className="p-2 rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaRegBookmark size={16} />
              </button>
              <button
                className="p-2 rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <RiShare2Line size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment modal */}
      <CommentForm
        form={{ isOpen: commentOpen, comment }}
        setForm={(updater) => {
          const next = typeof updater === "function"
            ? updater({ isOpen: commentOpen, comment })
            : updater;
          setCommentOpen(next.isOpen);
          setComment(next.comment);
        }}
        onSubmit={handleComment}
        placeHolder="Post your reply"
      />
    </article>
  );
};

export default TweetCard;
