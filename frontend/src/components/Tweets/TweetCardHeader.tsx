import Image from "next/image";
import xIcon from "../../public/x-icon.jpg";
import { Tweet } from "@/types";
import React from "react";
import { formatDate } from "@/utils/dateFormater";

type Props = {
  tweet: Tweet;
};

const TweetCardHeader: React.FC<Props> = ({ tweet }) => {
  const { userName, date, description } = tweet;

  return (
    <div className="flex gap-3" data-cy="TweetCardHeader">
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={xIcon}
          alt={"X image"}
          width={26}
          height={26}
          className="w-full h-full"
        />
      </div>
      <section>
        <div className="flex gap-2">
          <strong className="text-black text-md">{userName}</strong>
          <span className="text-sm" title={date ? formatDate(date) : "-"}>
            {date ? formatDate(date) : "-"}
          </span>
        </div>
        <h3 className="text-sm/7">{description}</h3>
      </section>
    </div>
  );
};

export default TweetCardHeader;
