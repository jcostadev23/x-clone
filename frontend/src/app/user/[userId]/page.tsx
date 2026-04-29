import { getUserById, getUserTweets, getMe } from "@/utils/apiCalls";
import UserPage from "./UserPage";
import UserProfileTweets from "./UserProfileTweets";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ userId: string }>;
};

const Page = async ({ params }: Props) => {
  const { userId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/signin");

  const [user, tweets, me] = await Promise.all([
    getUserById(userId, token),
    getUserTweets(userId, token),
    getMe(token),
  ]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#536471] text-[17px]">User not found.</p>
      </div>
    );
  }

  const initial = user.userName?.[0]?.toUpperCase() ?? "?";
  const isOwnProfile = me?.userId === userId;
  const isFollowed = user.isFollowedByCurrentUser ?? false;

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
            <p className="text-[13px] text-[#536471]">{tweets.length} posts</p>
          </div>
        </div>

        {/* Banner */}
        {user.coverPhoto ? (
          <img src={user.coverPhoto} alt="Cover" className="h-[200px] w-full object-cover" />
        ) : (
          <div className="h-[200px] bg-[#CFD9DE]" />
        )}

        {/* Avatar + action buttons row */}
        <div className="flex items-start justify-between px-4 -mt-12 mb-3">
          <div className="w-[120px] h-[120px] rounded-full bg-indigo-500 border-4 border-white flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.userName} className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div className="mt-14">
            <UserPage
              userId={userId}
              initialUser={user}
              isOwnProfile={isOwnProfile}
              initialFollowed={isFollowed}
            />
          </div>
        </div>

        {/* User info */}
        <div className="px-4 mb-4">
          <h1 className="text-[20px] font-extrabold text-[#0F1419] leading-tight">
            {user.userName}
          </h1>
          <p className="text-[15px] text-[#536471]">@{user.userName}</p>

          {user.bio && (
            <p className="text-[15px] text-[#0F1419] mt-2">{user.bio}</p>
          )}

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
              <strong>{Array.isArray(user.follow) ? user.follow.length : 0}</strong>{" "}
              <span className="text-[#536471]">Following</span>
            </span>
            <span className="text-[#0F1419]">
              <strong>{user.followersCount ?? 0}</strong>{" "}
              <span className="text-[#536471]">Followers</span>
            </span>
          </div>
        </div>

        {/* Profile tabs + tweets */}
        <UserProfileTweets tweets={tweets} userName={user.userName} />
      </div>
    </div>
  );
};

export default Page;
