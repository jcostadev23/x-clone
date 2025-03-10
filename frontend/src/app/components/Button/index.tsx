import { ClickEvent } from "../types";

type Props = {
  type?: "button" | "submit" | "reset";
  onClick?: ClickEvent;
  children: React.ReactNode;
};
const Button: React.FC<Props> = ({ type = "button", onClick, children }) => {
  const handleClick: ClickEvent = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className="bg-gray-500 text-white font-bold px-4 py-2 rounded-3xl"
      type={type}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
