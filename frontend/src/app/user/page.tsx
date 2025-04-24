import Link from "next/link";
import HomeIcon from "../components/Icons/HomeIcon";

const UserPage = () => {
  return (
    <div>
      <Link href="/" className="flex items-center gap-1  rounded-3xl px-3 py-3">
        <HomeIcon />
        Home
      </Link>
    </div>
  );
};

export default UserPage;
