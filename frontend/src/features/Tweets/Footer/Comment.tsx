import ButtonIcon from "@/components/ButtonIcon";
import CommentIcon from "@/components/Icons/CommentIcon";
import CommentForm from "../components/CommentForm";

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
  form,
  setForm,
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
      <CommentForm
        form={form}
        setForm={setForm}
        onSubmit={onSubmit}
        placeHolder="Post your reply"
      />
    </div>
  );
};
export default Comment;
