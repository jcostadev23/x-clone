"use client";

import { ActionsType } from "@/app/helpers/reducer";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useReducerContext } from "@/app/hooks/useReducer";
import { getAllTweets, postTweet } from "@/app/utils/apiCalls";
import { useState } from "react";
import Button from "../Button";
import Input from "../Form/Input";
import { FormEvents } from "../types";

const PostTweet = () => {
  const [tweet, setTweet] = useState("");
  const { setIsLoading } = useAppContext();
  const { dispatch } = useReducerContext();

  const onSubmit = async (event: FormEvents) => {
    event.preventDefault();
    if (!tweet.trim()) {
      return;
    }

    setIsLoading(true);
    const response = await postTweet({
      userId: 21,
      userName: "Costa",
      description: tweet,
      comments: [],
      likes: [],
    });

    setIsLoading(false);

    if (!response) {
      return false;
    }

    setTweet("");
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
    <form onSubmit={onSubmit}>
      <section className="flex gap-3 items-center p-6">
        <span className="text-2xl text-white bg-indigo-500 p-4 rounded-full w-12 h-12 flex items-center justify-center">
          J
        </span>
        <Input
          value={tweet}
          onChange={setTweet}
          placeholder="What is happening?!"
        />
      </section>
      <div className="flex justify-end m-2">
        <Button
          type="submit"
          label="Post"
          applyMinWidth
          backgroundColor="secondary"
        />
      </div>
    </form>
  );
};

export default PostTweet;
