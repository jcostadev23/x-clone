"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { Message } from "@/types";
import { getMessages, getUserById, sendMessage } from "@/utils/apiCalls";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { IoSendSharp } from "react-icons/io5";

type Props = { params: Promise<{ userId: string }> };

export default function ConversationPage({ params }: Props) {
  const { user } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [otherUserName, setOtherUserName] = useState("");
  const [otherId, setOtherId] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { userId } = await params;
      setOtherId(userId);
      const [msgs, otherUser] = await Promise.all([
        getMessages(userId),
        getUserById(userId),
      ]);
      setMessages(msgs);
      setOtherUserName(otherUser?.userName ?? "");
      setLoading(false);
    })();
  }, [params]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!otherId) return;
    const interval = setInterval(async () => {
      const msgs = await getMessages(otherId);
      setMessages(msgs);
    }, 5000);
    return () => clearInterval(interval);
  }, [otherId]);

  const handleSend = useCallback(async () => {
    if (!text.trim() || !otherId) return;
    const msg = await sendMessage(otherId, text.trim());
    if (msg) {
      setMessages((prev) => [...prev, msg]);
      setText("");
    }
  }, [otherId, text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-6 h-6 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[600px] mx-auto border-x border-[#EFF3F4]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md flex items-center gap-4 px-4 py-3 border-b border-[#EFF3F4]">
        <Link href="/messages" className="p-2 rounded-full hover:bg-[#E7E7E8] transition-colors text-[#0F1419]">
          <HiOutlineArrowLeft size={20} />
        </Link>
        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
          {otherUserName?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-[15px] text-[#0F1419] leading-tight">{otherUserName}</p>
          <p className="text-[13px] text-[#536471]">@{otherUserName}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-center text-[#536471] text-[15px] py-8">No messages yet. Say hello!</p>
        )}
        {messages.map((msg) => {
          const isMine = msg.fromUserId === user?.userId;
          return (
            <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[15px] ${
                  isMine
                    ? "bg-[#1D9BF0] text-white rounded-br-sm"
                    : "bg-[#EFF3F4] text-[#0F1419] rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-[#EFF3F4] px-4 py-3">
        <div className="flex items-center gap-3 bg-[#EFF3F4] rounded-full px-4 py-2">
          <textarea
            rows={1}
            placeholder="Start a new message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[#0F1419] placeholder-[#536471] text-[15px] outline-none resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="text-[#1D9BF0] disabled:opacity-30 hover:text-[#1A8CD8] transition-colors flex-shrink-0"
          >
            <IoSendSharp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
