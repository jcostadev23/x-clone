"use client";

import Menu from "@/components/Menu";
import Sugestions from "@/components/Sugestions";
import { Notification } from "@/types";
import { getNotifications, markNotificationsRead } from "@/utils/apiCalls";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { HiOutlineUserAdd } from "react-icons/hi";

const typeIcon = {
  like: <FaHeart className="text-rose-500" size={18} />,
  retweet: <BiRepost className="text-emerald-500" size={20} />,
  comment: <FaRegComment className="text-[#1D9BF0]" size={18} />,
  follow: <HiOutlineUserAdd className="text-[#1D9BF0]" size={18} />,
};

const typeText = {
  like: "liked your post",
  retweet: "reposted your post",
  comment: "replied to your post",
  follow: "followed you",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getNotifications();
      setNotifications(data);
      setLoading(false);
      await markNotificationsRead();
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1265px] mx-auto flex">
        <Menu />

        <main className="flex-1 max-w-[600px] border-x border-[#EFF3F4] min-h-screen">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md px-4 py-3 border-b border-[#EFF3F4]">
            <h2 className="text-[20px] font-bold text-[#0F1419]">Notifications</h2>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="px-8 py-12 text-center">
              <h2 className="text-[23px] font-extrabold text-[#0F1419] mb-2">Nothing to see here — yet</h2>
              <p className="text-[#536471] text-[15px]">From likes to reposts and a whole lot more, this is where all the action happens.</p>
            </div>
          )}

          {!loading && notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-3 px-4 py-3 border-b border-[#EFF3F4] hover:bg-[#F7F9F9] transition-colors ${!n.read ? "bg-[#F0F8FF]" : ""}`}
            >
              <div className="mt-1 flex-shrink-0">{typeIcon[n.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm mb-1">
                  {n.fromUserName?.[0]?.toUpperCase()}
                </div>
                <p className="text-[15px] text-[#0F1419]">
                  <Link href={`/user/${n.fromUserId}`} className="font-bold hover:underline">
                    {n.fromUserName}
                  </Link>{" "}
                  {typeText[n.type]}
                </p>
                <p className="text-[13px] text-[#536471] mt-0.5">
                  {new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </main>

        <Sugestions />
      </div>
    </div>
  );
}
