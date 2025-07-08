"use client";
import { useAppContext } from "@/hooks/useAppContext";
import { follow } from "@/utils/apiCalls";
import { redirect, useParams } from "next/navigation";
import { useCallback } from "react";
import Button from "../Button";

const FollowUsers = () => {
  const params = useParams();
  const userId = params?.userId as string;
  const { setIsLoading } = useAppContext();

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    const response = await follow(userId);
    setIsLoading(false);

    if (response) {
      redirect("/");
    }
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
