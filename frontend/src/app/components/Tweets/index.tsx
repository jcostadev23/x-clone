"use client";

import { ActionsType } from "@/app/helpers/reducer";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useReducerContext } from "@/app/hooks/useReducer";
import { getAllTweets } from "@/app/utils/apiCalls";
import { useEffect } from "react";
import Loading from "../Loader";
import TweetCard from "./TweetCard";

const Tweets = () => {
  const { isLoading, setIsLoading } = useAppContext();
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
      {isLoading && <Loading />}
      {state.tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
    </>
  );
};

export default Tweets;
