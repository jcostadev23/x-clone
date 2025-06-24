"use client";

import { ActionsType } from "@/helpers/reducer";
import { useAppContext } from "@/hooks/useAppContext";
import { useReducerContext } from "@/hooks/useReducer";
import { Tweet } from "@/types";
import { addComment, getAllTweets } from "@/utils/apiCalls";
import React, { useCallback, useState } from "react";
import ButtonIcon from "../ButtonIcon";
import Form from "../../components/Comments/Form";
import CommentIcon from "../Icons/CommentIcon";
import Modal from "../Modal";

type Props = {
  tweet: Tweet;
};

const Comment: React.FC<Props> = ({ tweet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { setIsLoading } = useAppContext();
  const { dispatch } = useReducerContext();

  const handleSubmit = useCallback(async () => {
    if (!comment || !tweet._id) {
      return false;
    }

    setIsLoading(true);
    const response = await addComment(tweet._id, { id: tweet.userId, comment });
    setIsLoading(false);

    if (!response) {
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
  }, [comment, tweet.userId, tweet._id, setIsLoading]);

  return (
    <div>
      <ButtonIcon
        className={"hover:text-blue-600"}
        onClick={() => setIsOpen(true)}
        icon={<CommentIcon />}
      >
        {tweet.comments.length}
      </ButtonIcon>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Form
          value={comment}
          placeHolder="Post your reply"
          onChange={setComment}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default Comment;
