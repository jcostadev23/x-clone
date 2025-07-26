import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const FooterRoot: React.FC<Props> = ({ children }) => {
  return (
    <div
      data-cy="TweetCardFooter"
      className="flex gap-2 m-3 justify-between max-w-full"
    >
      {children}
    </div>
  );
};

export default FooterRoot;
