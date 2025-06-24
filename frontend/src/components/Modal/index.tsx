import CloseIcon from "../../components/Icons/CloseIcon";

type Props = {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<Props> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-white w-[600px] rounded-lg shadow-lg relative flex flex-col gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between text-gray-500 w-full px-4 py-1">
          {title ?? " "}
          <button onClick={onClose}>
            <span className="cursor-pointer">
              <CloseIcon />
            </span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
