"use client";

import { useState } from "react";
import Input from "../Form/Input";
import Button from "../Button";
import { FormEvents } from "../types";
import { postTweet } from "@/app/utils/apiCalls";

const PostTweet = () => {
  const [tweet, setTweet] = useState("");

  const onSubmit = async (event: FormEvents) => {
    event.preventDefault();
    const result = await postTweet({
      userId: 21,
      userName: "Costa",
      description: tweet,
      comments: [],
      likes: [],
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
