"use client";

import Button from "@/components/Button";
import { useAppContext } from "@/hooks/useAppContext";
import { follow } from "@/utils/apiCalls";
import React, { useCallback, useState } from "react";

type Props = {
  userId: string;
};

const UserPage: React.FC<Props> = ({ userId }) => {
  const { setIsLoading } = useAppContext();
  const [userIsFlollowed, setUserIsFollowed] = useState(false);

  const handleClick = useCallback(async () => {
    if (!userId) {
      return false;
    }

    setUserIsFollowed(true);
    setIsLoading(true);
    const resp = await follow(userId);
    setIsLoading(false);

    if (!resp) {
      setUserIsFollowed(false);
      return false;
    }
  }, [setIsLoading, userId]);

  return (
    <>
      {!userIsFlollowed && (
        <Button
          applyMinWidth
          onClick={handleClick}
          label="Follow"
          className="text-lg"
        />
      )}
    </>
  );
};

export default UserPage;
