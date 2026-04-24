import { getUserById } from "@/utils/apiCalls";
import UserPage from "./UserPage";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Link from "next/link";

type Props = {
  params: { userId: string };
};

const Page: React.FC<Props> = async ({ params }) => {
  const { userId } = await params;
  const user = await getUserById(userId);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#536471] text-[17px]">User not found.</p>
      </div>
    );
  }

  const initial = user.userName?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[600px] mx-auto border-x border-[#EFF3F4] min-h-screen">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md flex items-center gap-6 px-4 py-3 border-b border-[#EFF3F4]">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-[#E7E7E8] transition-colors text-[#0F1419]"
          >
            <HiOutlineArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-[20px] font-bold text-[#0F1419] leading-tight">
              {user.userName}
            </h2>
            <p className="text-[13px] text-[#536471]">0 posts</p>
          </div>
        </div>

        {/* Banner */}
        <div className="h-[200px] bg-[#CFD9DE]" />

        {/* Avatar + follow button row */}
        <div className="flex items-start justify-between px-4 -mt-12 mb-3">
          <div className="w-[120px] h-[120px] rounded-full bg-indigo-500 border-4 border-white flex items-center justify-center text-white text-4xl font-bold">
            {initial}
          </div>
          <div className="mt-14">
            <UserPage userId={userId} />
          </div>
        </div>

        {/* User info */}
        <div className="px-4 mb-4">
          <h1 className="text-[20px] font-extrabold text-[#0F1419] leading-tight">
            {user.userName}
          </h1>
          <p className="text-[15px] text-[#536471]">@{user.userName}</p>
          {user.createdAt && (
            <p className="text-[15px] text-[#536471] mt-2">
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <div className="flex gap-4 mt-3 text-[15px]">
            <span className="text-[#0F1419]">
              <strong>0</strong>{" "}
              <span className="text-[#536471]">Following</span>
            </span>
            <span className="text-[#0F1419]">
              <strong>0</strong>{" "}
              <span className="text-[#536471]">Followers</span>
            </span>
          </div>
        </div>

        {/* Profile tabs */}
        <div className="flex border-b border-[#EFF3F4]">
          {["Posts", "Replies", "Media", "Likes"].map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 py-4 text-[15px] font-medium text-[#536471] hover:bg-[#E7E7E8] transition-colors relative ${
                i === 0 ? "text-[#0F1419] font-bold" : ""
              }`}
            >
              {tab}
              {i === 0 && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1D9BF0] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center px-8 pt-12">
          <h2 className="text-[31px] font-extrabold text-[#0F1419] mb-2">
            No posts yet
          </h2>
          <p className="text-[15px] text-[#536471] text-center">
            When {user.userName} posts, their posts will show up here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
