"use client";

import { ActionsType } from "@/helpers/reducer";
import { useAppContext } from "@/hooks/useAppContext";
import { useReducerContext } from "@/hooks/useReducer";
import { getAllTweets } from "@/utils/apiCalls";
import { useEffect } from "react";
import TweetCard from "./TweetCard";
import Loading from "../Loader";

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
