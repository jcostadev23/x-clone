import Search from "../Search";

const trends = [
  { category: "Technology", name: "#OpenSource", count: "12.4K" },
  { category: "Sports · Trending", name: "Champions League", count: "89.2K" },
  { category: "Politics · Trending", name: "#Election2024", count: "234K" },
  { category: "Entertainment", name: "Oscar nominations", count: "45.1K" },
  { category: "Business · Trending", name: "#Bitcoin", count: "178K" },
];

const suggestedUsers = [
  { name: "Vercel", handle: "vercel", initial: "V", bg: "bg-black" },
  { name: "Next.js", handle: "nextjs", initial: "N", bg: "bg-gray-800" },
  { name: "Tailwind CSS", handle: "tailwindcss", initial: "T", bg: "bg-sky-500" },
];

const Sugestions = () => {
  return (
    <aside className="hidden lg:flex flex-col w-[350px] flex-shrink-0 pl-8 pt-2 pb-4 sticky top-0 h-screen overflow-y-auto">
      {/* Sticky search */}
      <div className="sticky top-0 bg-white pt-1 pb-3 z-10">
        <Search />
      </div>

      {/* What's happening */}
      <div className="bg-[#F7F9F9] rounded-2xl mb-4 overflow-hidden">
        <h2 className="font-extrabold text-[20px] px-4 pt-3 pb-1 text-[#0F1419]">
          What&apos;s happening
        </h2>
        {trends.map((trend) => (
          <div
            key={trend.name}
            className="px-4 py-3 hover:bg-black/5 cursor-pointer transition-colors"
          >
            <p className="text-[#536471] text-[13px]">{trend.category}</p>
            <p className="font-bold text-[#0F1419] text-[15px] leading-tight">
              {trend.name}
            </p>
            <p className="text-[#536471] text-[13px]">{trend.count} posts</p>
          </div>
        ))}
        <div className="px-4 py-3 text-[#1D9BF0] hover:bg-black/5 cursor-pointer transition-colors text-[15px]">
          Show more
        </div>
      </div>

      {/* Who to follow */}
      <div className="bg-[#F7F9F9] rounded-2xl mb-4 overflow-hidden">
        <h2 className="font-extrabold text-[20px] px-4 pt-3 pb-1 text-[#0F1419]">
          Who to follow
        </h2>
        {suggestedUsers.map((u) => (
          <div
            key={u.handle}
            className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 cursor-pointer transition-colors"
          >
            <div
              className={`w-10 h-10 rounded-full ${u.bg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
            >
              {u.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#0F1419] text-[15px] leading-tight truncate">
                {u.name}
              </p>
              <p className="text-[#536471] text-[15px] leading-tight truncate">
                @{u.handle}
              </p>
            </div>
            <button className="bg-[#0F1419] text-white text-[15px] font-bold rounded-full px-4 py-1.5 hover:bg-[#272C30] transition-colors flex-shrink-0">
              Follow
            </button>
          </div>
        ))}
        <div className="px-4 py-3 text-[#1D9BF0] hover:bg-black/5 cursor-pointer transition-colors text-[15px]">
          Show more
        </div>
      </div>

      {/* Footer links */}
      <div className="px-4 py-2 text-[#536471] text-[13px] flex flex-wrap gap-x-2 gap-y-1">
        {["Terms of Service", "Privacy Policy", "Cookie Policy", "Accessibility", "Ads info", "More"].map(
          (link) => (
            <span
              key={link}
              className="hover:underline cursor-pointer"
            >
              {link}
            </span>
          )
        )}
        <span>© 2024 X Corp.</span>
      </div>
    </aside>
  );
};

export default Sugestions;
