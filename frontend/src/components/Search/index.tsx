import { HiOutlineSearch } from "react-icons/hi";

const Search = () => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#536471]">
        <HiOutlineSearch size={18} />
      </div>
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-[#EFF3F4] rounded-full py-3 pl-12 pr-4 text-[#0F1419] text-[15px] placeholder-[#536471] outline-none focus:bg-white focus:ring-1 focus:ring-[#1D9BF0] border border-transparent focus:border-[#1D9BF0] transition-all"
      />
    </div>
  );
};

export default Search;
