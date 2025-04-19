import clsx from "clsx";
import { ReactElement } from "react";

type Props = {
  className: string;
  onClick: () => void;
  icon: ReactElement;
  children: number;
};
const ButtonIcon: React.FC<Props> = ({
  className,
  onClick,
  children,
  icon,
}) => {
  return (
    <button
      type="button"
      className={clsx("flex gap-1.5 items-center text-gray-600", className)}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
};

export default ButtonIcon;
