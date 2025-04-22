"use client";

import { Tweet } from "@/app/types";
import React, { useCallback, useState } from "react";
import ButtonIcon from "../ButtonIcon";
import Form from "../Comments/Form";
import CommentIcon from "../Icons/CommentIcon";
import Modal from "../Modal";
import { useAppContext } from "@/app/hooks/useAppContext";
import { addComment } from "@/app/utils/apiCalls";

type Props = {
  tweet: Tweet;
};

const Comment: React.FC<Props> = ({ tweet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { setIsLoading } = useAppContext();

  const handleSubmit = useCallback(async () => {
    if (!comment || !tweet._id) {
      return false;
    }

    setIsLoading(true);
    await addComment(tweet._id, { id: tweet.userId, comment });
    setIsLoading(false);
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
