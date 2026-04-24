import { clsx } from "clsx";
import { ClickEvent } from "../types";

const buttonColors = {
  primary: "bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white",
  secondary: "bg-[#0F1419] hover:bg-[#272C30] text-white",
  outline: "border border-[#1D9BF0] text-[#1D9BF0] hover:bg-[#1D9BF0]/10",
  danger: "bg-rose-500 hover:bg-rose-600 text-white",
};

type Props = {
  type?: "button" | "submit" | "reset";
  onClick?: ClickEvent;
  label: string;
  backgroundColor?: "primary" | "secondary" | "outline" | "danger";
  applyMinWidth?: boolean;
  className?: string;
};

const Button: React.FC<Props> = ({
  type = "button",
  onClick,
  label = "Click",
  applyMinWidth = false,
  backgroundColor = "primary",
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "font-bold rounded-full transition-colors",
        applyMinWidth ? "px-4 py-1.5 text-[15px]" : "w-full px-4 py-2 text-[17px]",
        buttonColors[backgroundColor],
        className
      )}
      type={type}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
