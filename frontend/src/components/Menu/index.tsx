"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { signOut } from "@/utils/apiCalls";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import {
  HiOutlineBell,
  HiOutlineDotsCircleHorizontal,
  HiOutlineMail,
  HiOutlineSearch,
  HiOutlineSparkles,
  HiPencil,
} from "react-icons/hi";
import {
  FaRegBookmark,
  FaRegUser,
} from "react-icons/fa";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

const XLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
};

const Menu = () => {
  const { user } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const initial = user?.userName?.[0]?.toUpperCase() ?? "?";

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: <GoHome size={26} />,
      activeIcon: <GoHomeFill size={26} />,
    },
    {
      label: "Explore",
      href: "/explore",
      icon: <HiOutlineSearch size={26} />,
      activeIcon: <HiOutlineSearch size={26} className="stroke-2" />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <HiOutlineBell size={26} />,
      activeIcon: <HiOutlineBell size={26} className="stroke-2" />,
    },
    {
      label: "Messages",
      href: "/messages",
      icon: <HiOutlineMail size={26} />,
      activeIcon: <HiOutlineMail size={26} className="stroke-2" />,
    },
    {
      label: "Bookmarks",
      href: "/bookmarks",
      icon: <FaRegBookmark size={22} />,
      activeIcon: <FaRegBookmark size={22} style={{ fill: "#0F1419" }} />,
    },
    {
      label: "Profile",
      href: user?.userId ? `/user/${user.userId}` : "/signin",
      icon: <FaRegUser size={22} />,
      activeIcon: <FaRegUser size={22} style={{ fill: "#0F1419" }} />,
    },
    {
      label: "More",
      href: "#",
      icon: <HiOutlineDotsCircleHorizontal size={26} />,
      activeIcon: <HiOutlineDotsCircleHorizontal size={26} />,
    },
  ];

  return (
    <aside className="sticky top-0 h-screen flex flex-col items-center xl:items-start w-[72px] xl:w-[275px] px-2 xl:px-3 pt-2 pb-4 flex-shrink-0">
      {/* X Logo */}
      <Link
        href="/"
        className="p-3 rounded-full hover:bg-[#E7E7E8] transition-colors mb-1 text-[#0F1419]"
        aria-label="X home"
      >
        <XLogo />
      </Link>

      {/* Nav Items */}
      <nav className="flex flex-col gap-0.5 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-4 px-3 py-3 rounded-full hover:bg-[#E7E7E8] transition-colors w-fit xl:w-full"
            >
              <span className={`text-[#0F1419] ${isActive ? "font-bold" : ""}`}>
                {isActive ? item.activeIcon : item.icon}
              </span>
              <span
                className={`hidden xl:block text-xl text-[#0F1419] ${
                  isActive ? "font-bold" : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Post Button */}
      <Link
        href="/"
        className="mt-4 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold rounded-full transition-colors
          flex items-center justify-center
          w-[52px] h-[52px] xl:w-full xl:h-auto xl:py-3 xl:px-6"
        aria-label="Post"
      >
        <HiPencil size={24} className="xl:hidden" />
        <span className="hidden xl:block text-[17px]">Post</span>
      </Link>

      {/* Bottom user profile + sign out */}
      {user?.userName && (
        <div className="mt-auto relative w-fit xl:w-full" ref={accountRef}>
          {accountMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setAccountMenuOpen(false)} />
              <div className="absolute bottom-full left-0 mb-2 z-50 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.15)] border border-[#EFF3F4] min-w-[250px] py-1 overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-bold text-[#0F1419] hover:bg-[#F7F9F9] transition-colors"
                  onClick={handleSignOut}
                >
                  <HiArrowRightOnRectangle size={18} />
                  Sign out @{user.userName}
                </button>
              </div>
            </>
          )}
          <button
            className="flex items-center gap-3 p-3 rounded-full hover:bg-[#E7E7E8] transition-colors cursor-pointer w-full"
            onClick={() => setAccountMenuOpen((o) => !o)}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <div className="hidden xl:flex flex-col min-w-0 flex-1">
              <span className="font-bold text-[15px] text-[#0F1419] truncate leading-tight">
                {user.userName}
              </span>
              <span className="text-[15px] text-[#536471] truncate leading-tight">
                @{user.userName}
              </span>
            </div>
            <HiOutlineSparkles size={18} className="hidden xl:block text-[#536471] ml-auto" />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Menu;
