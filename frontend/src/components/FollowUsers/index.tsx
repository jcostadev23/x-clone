"use client";
import { useCallback } from "react";
import Button from "../Button";
import { useParams } from "next/navigation";

const FollowUsers = () => {
  const params = useParams();
  const userId = params?.userId as string;

  const handleClick = useCallback(() => {
    console.log("id", userId);
  }, [userId]);

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
