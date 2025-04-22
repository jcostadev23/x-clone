"use client";

import { useReducerContext } from "@/app/hooks/useReducer";
import TweetCard from "./TweetCard";
import { useEffect } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import { getAllTweets } from "@/app/utils/apiCalls";
import { ActionsType } from "@/app/helpers/reducer";

const Tweets = () => {
  const { setIsLoading } = useAppContext();
  const { state, dispatch } = useReducerContext();

  useEffect(() => {
    (async () => {
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
    })();
  }, [setIsLoading, dispatch]);

  return (
    <>
      {state.tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
    </>
  );
};

export default Tweets;
