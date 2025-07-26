import Image from "next/image";
import xIcon from "../../../public/x-icon.jpg";

const Avatar = () => {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <Image
        src={xIcon}
        alt={"X image"}
        width={26}
        height={26}
        className="w-full h-full"
      />
    </div>
  );
};

export default Avatar;
