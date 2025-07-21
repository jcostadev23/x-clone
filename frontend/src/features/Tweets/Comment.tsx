import React from "react";
import ButtonIcon from "../../components/ButtonIcon";
import CommentForm from "./components/CommentForm";
import CommentIcon from "../../components/Icons/CommentIcon";
import Modal from "../../components/Modal";

interface FormState {
  isOpen: boolean;
  comment: string;
}

interface Props {
  commentsAmount: number;
  onSubmit: () => void;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

const Comment: React.FC<Props> = ({
  commentsAmount,
  onSubmit,
  setForm,
  form,
}) => {
  return (
    <div>
      <ButtonIcon
        className={"hover:text-blue-600"}
        onClick={() => setForm((prev) => ({ ...prev, isOpen: true }))}
        icon={<CommentIcon />}
      >
        {commentsAmount}
      </ButtonIcon>
      <Modal
        isOpen={form.isOpen}
        onClose={() => setForm((prev) => ({ ...prev, isOpen: true }))}
      >
        <CommentForm
          value={form.comment}
          placeHolder="Post your reply"
          onChange={(e) => setForm((prev) => ({ ...prev, comment: e }))}
          onSubmit={onSubmit}
        />
      </Modal>
    </div>
  );
};

export default Comment;
