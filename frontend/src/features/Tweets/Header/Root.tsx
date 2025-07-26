import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const HeaderRoot: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex gap-3" data-cy="TweetCardHeader">
      {children}
    </div>
  );
};
export default HeaderRoot;
