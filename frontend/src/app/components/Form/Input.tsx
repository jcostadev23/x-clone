import clsx from "clsx";
import { ChangeEvent } from "react";

type Props = {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  form?: boolean;
  type?: string;
};

const Input: React.FC<Props> = ({
  label,
  size = "md",
  className,
  value,
  onChange,
  placeholder,
  form,
  type = "text",
  ...props
}) => {
  const inputClass = clsx(
    "text-gray-600 text-2xl w-full p-2 rounded-md outline-none bg-transparent",
    form &&
      "border border-gray-400 focus:ring-2 focus:border-none focus:ring-blue-500",
    {
      "py-1 text-sm": size === "sm",
      "py-2 text-base": size === "md",
      "py-3 text-lg": size === "lg",
    },
    className
  );
  const handleEvent = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-gray-700">{label}</label>}
      <input
        className={inputClass}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={handleEvent}
        {...props}
      ></input>
    </div>
  );
};

export default Input;
