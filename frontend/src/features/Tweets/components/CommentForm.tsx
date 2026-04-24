import Modal from "@/components/Modal";
import React from "react";

interface FormState {
  isOpen: boolean;
  comment: string;
}

type Props = {
  placeHolder: string;
  onSubmit: () => void;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
};

const CommentForm: React.FC<Props> = ({ onSubmit, form, setForm, placeHolder }) => {
  return (
    <Modal
      isOpen={form.isOpen}
      onClose={() => setForm((prev) => ({ ...prev, isOpen: false }))}
    >
      <form
        className="flex flex-col px-4 pb-4"
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      >
        <textarea
          data-cy="comment-textarea"
          value={form.comment}
          onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
          placeholder={placeHolder}
          rows={4}
          autoFocus
          className="w-full text-[20px] text-[#0F1419] placeholder-[#536471] outline-none bg-transparent resize-none leading-normal mb-4"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!form.comment.trim()}
            data-cy="comment-submit-btn"
          className="bg-[#1D9BF0] hover:bg-[#1A8CD8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[15px] font-bold rounded-full px-4 py-1.5 transition-colors"
          >
            Reply
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CommentForm;
