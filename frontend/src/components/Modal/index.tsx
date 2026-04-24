import CloseIcon from "../../components/Icons/CloseIcon";

type Props = {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<Props> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#5B7083]/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[600px] rounded-2xl shadow-xl relative flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-6 px-4 py-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#E7E7E8] transition-colors text-[#0F1419]"
          >
            <CloseIcon />
          </button>
          {title && <span className="font-bold text-[20px] text-[#0F1419]">{title}</span>}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
