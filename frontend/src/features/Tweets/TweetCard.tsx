"use client";

import { Tweet } from "@/types";
import TweetCardFooter from "./TweetCardFooter";
import TweetCardHeader from "./components/TweetCardHeader";
import { useAppContext } from "@/hooks/useAppContext";
import { useReducerContext } from "@/hooks/useReducer";
import { useCallback, useState } from "react";
import { addComment, tweetLikeUnlike } from "@/utils/apiCalls";
import { fetchAndSetTweets } from "@/helpers";

type Props = {
  tweet: Tweet;
};

const TweetCard: React.FC<Props> = ({ tweet }) => {
  const { setIsLoading, user } = useAppContext();
  const { dispatch } = useReducerContext();
  const [formState, setFormState] = useState({
    isOpen: false,
    comment: "",
  });

  const liked = tweet.likes.includes(user?.userId as string);

  const handleLikeUnlikeClick = useCallback(async () => {
    if (!tweet._id || !user?.userId) {
      return false;
    }

    setIsLoading(true);
    const resp = await tweetLikeUnlike(tweet._id, user.userId);
    setIsLoading(false);

    if (!resp) {
      return false;
    }

    await fetchAndSetTweets(setIsLoading, dispatch);
  }, [dispatch, setIsLoading, tweet._id, user.userId]);

  const handleComment = useCallback(async () => {
    if (!formState.comment || !tweet._id) {
      return false;
    }

    setIsLoading(true);
    const response = await addComment(tweet._id, {
      id: tweet.userId,
      comment: formState.comment,
    });
    setIsLoading(false);

    if (!response) {
      return false;
    }

    await fetchAndSetTweets(setIsLoading, dispatch);
  }, [dispatch, formState.comment, setIsLoading, tweet._id, tweet.userId]);

  return (
    <div className="flex flex-col gap-3 bg-gray-100 hover:bg-gray-200 p-3 border-solid border-2 border-gray-300 max-w-full">
      <TweetCardHeader tweet={tweet} />
      <TweetCardFooter
        liked={liked}
        form={formState}
        setForm={setFormState}
        onSubmit={handleComment}
        likes={tweet.likes.length}
        onLike={handleLikeUnlikeClick}
        commentsAmount={tweet.comments.length}
      />
    </div>
  );
};

export default TweetCard;
