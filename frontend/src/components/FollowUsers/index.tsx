"use client";
import { useAppContext } from "@/hooks/useAppContext";
import { follow } from "@/utils/apiCalls";
import { useCallback } from "react";
import Button from "../Button";

type Props = {
  userId: string;
};

const FollowUsers: React.FC<Props> = ({ userId }) => {
  const { setIsLoading } = useAppContext();

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    await follow(userId);
    setIsLoading(false);
  }, [setIsLoading, userId]);

  return (
    <Button
      applyMinWidth
      onClick={handleClick}
      label="Follow"
      className="text-xl"
    />
  );
};

export default FollowUsers;
