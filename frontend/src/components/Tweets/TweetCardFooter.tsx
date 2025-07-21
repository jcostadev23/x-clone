"use client";

import { ActionsType } from "@/helpers/reducer";
import { useAppContext } from "@/hooks/useAppContext";
import { useReducerContext } from "@/hooks/useReducer";
import { Tweet } from "@/types";
import { getAllTweets, tweetLikeUnlike } from "@/utils/apiCalls";
import BookMarkIcon from "../Icons/BookMarkIcon";
import RepostIcon from "../Icons/RepostIcon";
import ShareIcon from "../Icons/ShareIcon";
import ViewIcon from "../Icons/ViewIcon";
import Comment from "../PostComment";
import LikeUnlikeButton from "../TweetButtons/LikeUnlikeButton";

type Props = {
  tweet: Tweet;
};

const TweetCardFooter: React.FC<Props> = ({ tweet }) => {
  const { setIsLoading, user } = useAppContext();
  const { dispatch } = useReducerContext();

  const liked = tweet.likes.includes(user?.userId as string);

  const handleLikeUnlikeClick = async () => {
    if (!tweet._id || !user?.userId) {
      return false;
    }

    setIsLoading(true);
    const resp = await tweetLikeUnlike(tweet._id, user.userId);
    setIsLoading(false);

    if (!resp) {
      return false;
    }

    setIsLoading(true);
    const tweets = await getAllTweets();
    setIsLoading(false);

    if (!tweets) {
      return false;
    }

    dispatch({
      type: ActionsType.SET_TWEETS,
      payload: tweets,
    });
  };

  return (
    <div
      data-cy="TweetCardFooter"
      className="flex gap-2 m-3 justify-between max-w-full"
    >
      <Comment tweet={tweet} />
      <div className="flex gap-1.5 items-center text-gray-600 hover:text-emerald-500">
        <RepostIcon />
        123k
      </div>
      <LikeUnlikeButton
        liked={liked}
        likes={tweet.likes.length}
        onLike={handleLikeUnlikeClick}
      />
      <div className="flex gap-1.5 items-center text-gray-600 hover:text-blue-500">
        <ViewIcon /> 4.5m
      </div>
      <div className="flex gap-3 items-center">
        <BookMarkIcon />
        <ShareIcon />
      </div>
    </div>
  );
};

export default TweetCardFooter;
