"use client";

import Button from "@/components/Button";
import { useAppContext } from "@/hooks/useAppContext";
import { follow, unfollow } from "@/utils/apiCalls";
import React, { useCallback, useState } from "react";

type Props = {
  userId: string;
};

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

  return (
    <>
      {isFollowed ? (
        <Button applyMinWidth onClick={handleUnfollow} label="Unfollow" className="text-lg" />
      ) : (
        <Button applyMinWidth onClick={handleFollow} label="Follow" className="text-lg" />
      )}
    </>
  );
};

export default UserPage;
