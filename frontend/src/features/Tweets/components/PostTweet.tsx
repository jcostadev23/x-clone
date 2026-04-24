"use client";

import { fetchAndSetTweets } from "@/helpers";
import { useAppContext } from "@/hooks/useAppContext";
import { useReducerContext } from "@/hooks/useReducer";
import { postTweet } from "@/utils/apiCalls";
import { useState } from "react";
import Button from "../../../components/Button";
import TextArea from "../../../components/Form/TextArea";
import { FormEvents } from "../../../components/types";

const PostTweet = () => {
  const [tweet, setTweet] = useState("");
  const { startLoading, stopLoading, user } = useAppContext();
  const { dispatch } = useReducerContext();

  const onSubmit = async (event: FormEvents) => {
    event.preventDefault();
    if (!tweet.trim()) return;

    startLoading();
    const response = await postTweet({ description: tweet.trim(), comments: [], likes: [] });
    if (response) {
      setTweet("");
      await fetchAndSetTweets(startLoading, stopLoading, dispatch);
    }
    stopLoading();
  };

  const initial = user?.userName?.[0]?.toUpperCase() ?? "?";

  return (
    <form onSubmit={onSubmit}>
      <section className="flex gap-3 items-center p-6">
        <span className="text-2xl text-white bg-indigo-500 p-4 rounded-full w-12 h-12 flex items-center justify-center">
          {initial}
        </span>
        <TextArea
          rows={2}
          value={tweet}
          onChange={setTweet}
          placeholder="What is happening?!"
        />
      </section>
      <div className="flex justify-end m-2">
        <Button type="submit" label="Post" applyMinWidth backgroundColor="secondary" />
      </div>
    </form>
  );
};

export default PostTweet;
