"use client";

import Link from "next/link";
import UserIcon from "../Icons/UserIcon";
import { useAppContext } from "@/hooks/useAppContext";

const Menu = () => {
  const {
    user: { userName },
  } = useAppContext();

  return (
    <aside className="flex flex-col flex-[2]">
      <div className="flex justify-center items-center">
        <Link
          href="/signin"
          className="flex justify-end items-center gap-1  rounded-3xl px-3 py-3"
        >
          <UserIcon />
          <span>{userName ?? "User"}</span>
        </Link>
      </div>
    </aside>
  );
};

export default Menu;
