import Link from "next/link";
import UserIcon from "../Icons/UserIcon";

const Menu = () => {
  return (
    <aside className="flex flex-col justify-between flex-[2]">
      <div>Estou aki</div>
      <Link
        href="/signin"
        className="flex justify-end items-center gap-1  rounded-3xl px-3 py-3"
      >
        <UserIcon />
        User
      </Link>
    </aside>
  );
};

export default Menu;
