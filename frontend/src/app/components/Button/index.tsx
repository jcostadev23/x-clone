import { ClickEvent } from "../types";

const buttonColors = {
  primary: "bg-blue-500",
  secondary: "bg-gray-500",
  danger: "bg-red-500",
};

type Props = {
  type: "button" | "submit" | "reset";
  onClick?: ClickEvent;
  label: string;
  backgroundColor: "primary" | "secondary" | "danger";
  applyMinWidth: boolean;
  size?: string;
};
const Button: React.FC<Props> = ({
  type = "button",
  onClick,
  label = "Click",
  applyMinWidth = false,
  backgroundColor = "primary",
  size = "medium",
  ...props
}) => {
  const width = applyMinWidth ? "min-w-20 px-2 py-1" : "min-w-50 px-4 py-2";

  const handleClick: ClickEvent = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={`${buttonColors[backgroundColor]} text-white font-bold rounded-3xl ${width}`}
      type={type}
      onClick={handleClick}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
