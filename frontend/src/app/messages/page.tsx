"use client";

import Menu from "@/components/Menu";
import { Conversation } from "@/types";
import { getConversations } from "@/utils/apiCalls";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getConversations();
      setConversations(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1265px] mx-auto flex">
        <Menu />

        <main className="flex-1 max-w-[600px] border-x border-[#EFF3F4] min-h-screen">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md px-4 py-3 border-b border-[#EFF3F4]">
            <h2 className="text-[20px] font-bold text-[#0F1419]">Messages</h2>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && conversations.length === 0 && (
            <div className="px-8 py-12 flex flex-col items-center text-center">
              <HiOutlineMail size={48} className="text-[#1D9BF0] mb-4" />
              <h2 className="text-[23px] font-extrabold text-[#0F1419] mb-2">Welcome to your inbox!</h2>
              <p className="text-[#536471] text-[15px] mb-6">Drop a line, share posts and more with private conversations between you and others on X. Start a conversation by visiting someone&apos;s profile.</p>
            </div>
          )}

          {!loading && conversations.map((conv) => (
            <Link
              key={conv.userId}
              href={`/messages/${conv.userId}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F9F9] transition-colors border-b border-[#EFF3F4]"
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                  {conv.userName?.[0]?.toUpperCase()}
                </div>
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1D9BF0] rounded-full flex items-center justify-center text-white text-[11px] font-bold">
                    {conv.unread > 9 ? "9+" : conv.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-[15px] ${conv.unread > 0 ? "font-bold text-[#0F1419]" : "font-medium text-[#0F1419]"}`}>
                    {conv.userName}
                  </span>
                  <span className="text-[13px] text-[#536471]">
                    {new Date(conv.lastMessageDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className={`text-[15px] truncate ${conv.unread > 0 ? "font-bold text-[#0F1419]" : "text-[#536471]"}`}>
                  {conv.lastMessage}
                </p>
              </div>
            </Link>
          ))}
        </main>

        {/* Right sidebar placeholder */}
        <div className="hidden lg:block w-[350px] px-8 py-4" />
      </div>
    </div>
  );
}
