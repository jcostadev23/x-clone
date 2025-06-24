"use cliente";

import { useAppContext } from "@/hooks/useAppContext";
import { signIn } from "@/utils/apiCalls";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import xIcon from "../../../../public/x-logo.png";
import Button from "../../Button";
import Input from "../../Form/Input";

type Props = {
  handleClose: (value: boolean) => void;
};

const SignInForm: React.FC<Props> = ({ handleClose }) => {
  const { setIsLoading } = useAppContext();
  const [user, setUser] = useState({ userName: "", passwordHash: "" });

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    await signIn(user);
    setIsLoading(false);
    handleClose(false);
  }, [handleClose, setIsLoading, user]);

  return (
    <>
      <form>
        <div className="flex flex-col items-center gap-3 text-black">
          <Image height={30} width={30} alt="x image" src={xIcon} />
          <h3>Sign in to X</h3>
        </div>
        <div className="flex flex-col gap-2 px-4 py-4">
          <Input
            label="Name"
            form={true}
            value={user.userName}
            onChange={(values) =>
              setUser((prev) => ({ ...prev, userName: values }))
            }
          />
          <Input
            label="Password"
            type="password"
            form={true}
            value={user.passwordHash}
            onChange={(value) =>
              setUser((prev) => ({ ...prev, passwordHash: value }))
            }
          />
        </div>
        <Button
          className="py-2 px-4 m-4 "
          backgroundColor="secondary"
          label="Sign in"
          onClick={onSubmit}
          applyMinWidth
        />
      </form>
    </>
  );
};

export default SignInForm;
