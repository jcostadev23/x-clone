"use client";

import { fetchAndSetTweets } from "@/helpers";
import { useAppContext } from "@/hooks/useAppContext";
import { useReducerContext } from "@/hooks/useReducer";
import { Tweet } from "@/types";
import { addComment, deleteTweet, notInterested, tweetBookmark, tweetLikeUnlike, tweetRetweet } from "@/utils/apiCalls";
import TweetDetailModal from "@/components/TweetDetailModal";
import { useCallback, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaBookmark, FaRegBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { IoMdStats } from "react-icons/io";
import { RiShare2Line } from "react-icons/ri";
import { HiOutlineTrash, HiOutlineFlag, HiOutlineEyeOff, HiOutlineInformationCircle } from "react-icons/hi";
import { MdOutlineSignalCellularAlt, MdOutlineWifiOff, MdOutlineBlock } from "react-icons/md";
import Link from "next/link";
import CommentForm from "./components/CommentForm";

type Props = { tweet: Tweet };

type Toast = { message: string; id: number };

const TweetCard: React.FC<Props> = ({ tweet }) => {
  const { startLoading, stopLoading, user } = useAppContext();
  const { dispatch } = useReducerContext();
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(tweet.bookmarkedBy?.includes(user?.userId as string) ?? false);
  const [interactionsOpen, setInteractionsOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const liked = tweet.likes.includes(user?.userId as string);
  const retweeted = tweet.retweets?.includes(user?.userId as string) ?? false;
  const isOwner = tweet.userId === user?.userId;
  const initial = tweet.userName?.[0]?.toUpperCase() ?? "?";

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { message, id }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const handleLike = useCallback(async () => {
    if (!tweet._id) return;
    await tweetLikeUnlike(tweet._id);
    await fetchAndSetTweets(startLoading, stopLoading, dispatch);
  }, [dispatch, startLoading, stopLoading, tweet._id]);

  const handleRetweet = useCallback(async () => {
    if (!tweet._id) return;
    await tweetRetweet(tweet._id);
    await fetchAndSetTweets(startLoading, stopLoading, dispatch);
  }, [dispatch, startLoading, stopLoading, tweet._id]);

  const handleBookmark = useCallback(async () => {
    if (!tweet._id) return;
    setBookmarked((b) => !b);
    await tweetBookmark(tweet._id);
  }, [tweet._id]);

  const handleDelete = useCallback(async () => {
    if (!tweet._id) return;
    setMenuOpen(false);
    startLoading();
    await deleteTweet(tweet._id);
    await fetchAndSetTweets(startLoading, stopLoading, dispatch);
    stopLoading();
  }, [dispatch, startLoading, stopLoading, tweet._id]);

  const handleNotInterested = useCallback(async () => {
    if (!tweet._id) return;
    setMenuOpen(false);
    setHidden(true);
    await notInterested(tweet._id);
  }, [tweet._id]);

  const handleComment = useCallback(async () => {
    if (!comment.trim() || !tweet._id) return;
    startLoading();
    await addComment(tweet._id, { id: tweet.userId, comment });
    setComment("");
    setCommentOpen(false);
    await fetchAndSetTweets(startLoading, stopLoading, dispatch);
    stopLoading();
  }, [comment, dispatch, startLoading, stopLoading, tweet._id, tweet.userId]);

  if (hidden) return null;

  return (
    <article
      data-cy="tweet-card"
      className="border-b border-[#EFF3F4] px-4 py-3 hover:bg-black/[0.02] cursor-pointer transition-colors relative"
      onClick={() => setDetailOpen(true)}
    >
      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div key={t.id} className="bg-[#1D9BF0] text-white text-[15px] font-medium px-5 py-3 rounded-full shadow-lg animate-fade-in">
              {t.message}
            </div>
          ))}
        </div>
      )}

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

            {/* Three dots menu */}
            <div className="ml-auto relative" ref={menuRef}>
              <button
                className="p-1.5 rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] text-[#536471] transition-colors"
                onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
              >
                <BsThreeDots size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-8 z-50 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.15)] border border-[#EFF3F4] min-w-[250px] py-1 overflow-hidden">
                  {isOwner ? (
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-bold text-red-500 hover:bg-[#FFF0F0] transition-colors"
                      onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    >
                      <HiOutlineTrash size={18} />
                      Delete
                    </button>
                  ) : (
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-bold text-[#0F1419] hover:bg-[#F7F9F9] transition-colors"
                      onClick={(e) => { e.stopPropagation(); handleNotInterested(); }}
                    >
                      <HiOutlineEyeOff size={18} />
                      Not interested in this post
                    </button>
                  )}

                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-[#0F1419] hover:bg-[#F7F9F9] transition-colors"
                    onClick={(e) => { e.stopPropagation(); setInteractionsOpen(true); setMenuOpen(false); }}
                  >
                    <MdOutlineSignalCellularAlt size={18} />
                    View post interactions
                  </button>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-[#0F1419] hover:bg-[#F7F9F9] transition-colors"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); handleBookmark(); }}
                  >
                    {bookmarked ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
                    {bookmarked ? "Remove bookmark" : "Bookmark"}
                  </button>

                  <div className="border-t border-[#EFF3F4] my-1" />

                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-[#0F1419] hover:bg-[#F7F9F9] transition-colors"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); showToast("Report submitted. Thank you for your feedback."); }}
                  >
                    <HiOutlineFlag size={18} />
                    Report post
                  </button>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-[#0F1419] hover:bg-[#F7F9F9] transition-colors"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); showToast("Post marked as spam."); }}
                  >
                    <MdOutlineBlock size={18} />
                    Mark as spam
                  </button>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-[#0F1419] hover:bg-[#F7F9F9] transition-colors"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); showToast("Community note requested."); }}
                  >
                    <HiOutlineInformationCircle size={18} />
                    Request community note
                  </button>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-[#0F1419] hover:bg-[#F7F9F9] transition-colors"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); showToast("Post saved for offline reading."); }}
                  >
                    <MdOutlineWifiOff size={18} />
                    Add to offline
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tweet text */}
          <p className="text-[15px] text-[#0F1419] mt-0.5 leading-normal break-words whitespace-pre-wrap">
            {tweet.description}
          </p>

          {/* Action row */}
          <div className="flex items-center justify-between mt-3 -ml-2 max-w-[425px] text-[#536471]">
            {/* Comment */}
            <button
              data-cy="tweet-comment-btn"
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
            <button
              className="group flex items-center gap-1"
              onClick={(e) => { e.stopPropagation(); handleRetweet(); }}
            >
              <span className={`p-2 rounded-full group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors ${retweeted ? "text-emerald-500" : ""}`}>
                <BiRepost size={20} />
              </span>
              <span className={`text-[13px] group-hover:text-emerald-500 ${retweeted ? "text-emerald-500" : ""}`}>
                {(tweet.retweets?.length ?? 0) > 0 ? (tweet.retweets?.length ?? 0) : ""}
              </span>
            </button>

            {/* Like */}
            <button
              data-cy="tweet-like-btn"
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
            <button
              className="group flex items-center gap-1"
              onClick={(e) => { e.stopPropagation(); setInteractionsOpen(true); }}
            >
              <span className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] transition-colors">
                <IoMdStats size={18} />
              </span>
            </button>

            {/* Bookmark + Share */}
            <div className="flex items-center">
              <button
                data-cy="tweet-bookmark-btn"
                className={`p-2 rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] transition-colors ${bookmarked ? "text-[#1D9BF0]" : ""}`}
                onClick={(e) => { e.stopPropagation(); handleBookmark(); }}
              >
                {bookmarked ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
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

      {/* Close menu on outside click */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Interactions modal */}
      {interactionsOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setInteractionsOpen(false)}>
            <div className="bg-white rounded-2xl shadow-xl w-[320px] p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-[20px] font-bold text-[#0F1419] mb-4">Post interactions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-[#536471]">Likes</span>
                  <span className="font-bold text-[#0F1419]">{tweet.likes.length}</span>
                </div>
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-[#536471]">Reposts</span>
                  <span className="font-bold text-[#0F1419]">{tweet.retweets?.length ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-[#536471]">Replies</span>
                  <span className="font-bold text-[#0F1419]">{tweet.comments.length}</span>
                </div>
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-[#536471]">Bookmarks</span>
                  <span className="font-bold text-[#0F1419]">{tweet.bookmarkedBy?.length ?? 0}</span>
                </div>
              </div>
              <button
                className="mt-6 w-full bg-[#0F1419] text-white font-bold rounded-full py-2.5 hover:bg-[#272C30] transition-colors text-[15px]"
                onClick={() => setInteractionsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

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

      {/* Tweet detail modal */}
      <TweetDetailModal
        tweetId={detailOpen ? (tweet._id ?? null) : null}
        onClose={() => setDetailOpen(false)}
      />
    </article>
  );
};

export default TweetCard;
