import Button from "@/components/Button";
import TextArea from "@/components/Form/TextArea";
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

const CommentForm: React.FC<Props> = ({
  onSubmit,
  form,
  setForm,
  placeHolder,
}) => {
  return (
    <Modal
      isOpen={form.isOpen}
      onClose={() => setForm((prev) => ({ ...prev, isOpen: false }))}
    >
      <form
        className="flex flex-col justify-between h-full"
        onSubmit={onSubmit}
      >
        <TextArea
          value={form.comment}
          onChange={(e) => setForm((prev) => ({ ...prev, comment: e }))}
          placeholder={placeHolder}
        />
        <div className="flex justify-end m-2">
          <Button
            type="submit"
            label="Reply"
            applyMinWidth
            backgroundColor="secondary"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CommentForm;
