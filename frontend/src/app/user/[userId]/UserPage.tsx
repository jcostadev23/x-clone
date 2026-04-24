"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { follow, unfollow } from "@/utils/apiCalls";
import React, { useCallback, useState } from "react";

type Props = { userId: string };

const UserPage: React.FC<Props> = ({ userId }) => {
  const { startLoading, stopLoading } = useAppContext();
  const [isFollowed, setIsFollowed] = useState(false);

  const handleFollow = useCallback(async () => {
    setIsFollowed(true);
    startLoading();
    const resp = await follow(userId);
    stopLoading();
    if (!resp?.success) setIsFollowed(false);
  }, [startLoading, stopLoading, userId]);

  const handleUnfollow = useCallback(async () => {
    setIsFollowed(false);
    startLoading();
    const resp = await unfollow(userId);
    stopLoading();
    if (!resp?.success) setIsFollowed(true);
  }, [startLoading, stopLoading, userId]);

  return isFollowed ? (
    <button
      onClick={handleUnfollow}
      className="border border-[#CFD9DE] text-[#0F1419] font-bold rounded-full px-4 py-1.5 text-[15px] hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
    >
      Following
    </button>
  ) : (
    <button
      onClick={handleFollow}
      className="bg-[#0F1419] hover:bg-[#272C30] text-white font-bold rounded-full px-4 py-1.5 text-[15px] transition-colors"
    >
      Follow
    </button>
  );
};

export default UserPage;
