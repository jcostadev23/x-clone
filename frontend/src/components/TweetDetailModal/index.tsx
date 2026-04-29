"use client";

import { getTweetDetail } from "@/utils/apiCalls";
import { TweetDetail } from "@/types";
import { useEffect, useState } from "react";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { HiOutlineX } from "react-icons/hi";
import Link from "next/link";

type Props = {
  tweetId: string | null;
  onClose: () => void;
};

const TweetDetailModal: React.FC<Props> = ({ tweetId, onClose }) => {
  const [detail, setDetail] = useState<TweetDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"comments" | "likes">("comments");

  useEffect(() => {
    if (!tweetId) { setDetail(null); return; }
    setLoading(true);
    setTab("comments");
    getTweetDetail(tweetId).then((d) => {
      setDetail(d);
      setLoading(false);
    });
  }, [tweetId]);

  if (!tweetId) return null;

  const initial = detail?.userName?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl w-full max-w-[600px] max-h-[80vh] flex flex-col shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-[#EFF3F4] flex-shrink-0">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#E7E7E8] transition-colors text-[#0F1419]"
            >
              <HiOutlineX size={20} />
            </button>
            <h2 className="text-[20px] font-bold text-[#0F1419]">Post</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-6 h-6 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : detail ? (
            <div className="overflow-y-auto flex-1">
              {/* Tweet body */}
              <div className="px-4 pt-4 pb-3 border-b border-[#EFF3F4]">
                <div className="flex gap-3 mb-3">
                  <Link href={`/user/${detail.userId}`} onClick={onClose}>
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 hover:opacity-90 transition-opacity">
                      {initial}
                    </div>
                  </Link>
                  <div>
                    <Link
                      href={`/user/${detail.userId}`}
                      onClick={onClose}
                      className="font-bold text-[15px] text-[#0F1419] hover:underline"
                    >
                      {detail.userName}
                    </Link>
                    <p className="text-[#536471] text-[15px]">@{detail.userName}</p>
                  </div>
                </div>
                <p className="text-[20px] text-[#0F1419] leading-normal break-words whitespace-pre-wrap mb-3">
                  {detail.description}
                </p>
                <p className="text-[#536471] text-[15px] mb-3">{detail.date}</p>

                {/* Counts row */}
                <div className="flex gap-5 py-3 border-t border-[#EFF3F4] text-[15px]">
                  <span>
                    <strong className="text-[#0F1419]">{detail.retweets?.length ?? 0}</strong>{" "}
                    <span className="text-[#536471]">Reposts</span>
                  </span>
                  <span>
                    <strong className="text-[#0F1419]">{detail.likerNames.length}</strong>{" "}
                    <span className="text-[#536471]">Likes</span>
                  </span>
                  <span>
                    <strong className="text-[#0F1419]">{detail.comments.length}</strong>{" "}
                    <span className="text-[#536471]">Replies</span>
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#EFF3F4] flex-shrink-0">
                <button
                  className={`flex-1 py-3 text-[15px] font-medium transition-colors hover:bg-[#F7F9F9] relative flex items-center justify-center gap-2 ${
                    tab === "comments" ? "text-[#0F1419] font-bold" : "text-[#536471]"
                  }`}
                  onClick={() => setTab("comments")}
                >
                  <FaRegComment size={15} />
                  Replies
                  {tab === "comments" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1D9BF0] rounded-full" />
                  )}
                </button>
                <button
                  className={`flex-1 py-3 text-[15px] font-medium transition-colors hover:bg-[#F7F9F9] relative flex items-center justify-center gap-2 ${
                    tab === "likes" ? "text-[#0F1419] font-bold" : "text-[#536471]"
                  }`}
                  onClick={() => setTab("likes")}
                >
                  <FaHeart size={14} className={tab === "likes" ? "text-rose-500" : ""} />
                  Liked by
                  {tab === "likes" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1D9BF0] rounded-full" />
                  )}
                </button>
              </div>

              {/* Replies */}
              {tab === "comments" && (
                <>
                  {detail.comments.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <p className="text-[#536471] text-[15px]">No replies yet. Be the first to reply!</p>
                    </div>
                  ) : (
                    detail.comments.map((c, i) => (
                      <div key={i} className="flex gap-3 px-4 py-3 border-b border-[#EFF3F4] hover:bg-black/[0.02] transition-colors">
                        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {(c.userName || c.id)?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-[15px] text-[#0F1419]">
                            {c.userName || c.id}
                          </span>
                          <p className="text-[15px] text-[#0F1419] mt-0.5 break-words whitespace-pre-wrap">
                            {c.comment}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Liked by */}
              {tab === "likes" && (
                <>
                  {detail.likerNames.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <p className="text-[#536471] text-[15px]">No likes yet.</p>
                    </div>
                  ) : (
                    detail.likerNames.map((name) => (
                      <div key={name} className="flex items-center gap-3 px-4 py-3 border-b border-[#EFF3F4] hover:bg-black/[0.02] transition-colors">
                        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {name[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-bold text-[15px] text-[#0F1419]">{name}</p>
                          <p className="text-[#536471] text-[15px]">@{name}</p>
                        </div>
                        <FaHeart size={14} className="ml-auto text-rose-500" />
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="text-[#536471] text-[15px]">Post not found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TweetDetailModal;
