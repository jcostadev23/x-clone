import clsx from "clsx";
import { ChangeEvent } from "react";

type Props = {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

const TextArea: React.FC<Props> = ({
  label,
  size = "md",
  className,
  value,
  onChange,
  placeholder = "PlaceHolder...",
  rows = 5,
  ...props
}) => {
  const textAreaClass = clsx(
    "text-gray-600 text-2xl w-full h-full p-2 rounded-md outline-none bg-transparent resize-none",
    {
      "py-1 text-sm": size === "sm",
      "py-2 text-base": size === "md",
      "py-3 text-lg": size === "lg",
    },
    className
  );
  const handleEvent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex flex-col gap-1 w-full p-2">
      {label && <label className="text-gray-700">{label}</label>}
      <textarea
        data-cy="new-comment"
        rows={rows}
        value={value}
        onChange={handleEvent}
        className={textAreaClass}
        placeholder={placeholder}
        {...props}
      ></textarea>
    </div>
  );
};

export default TextArea;
