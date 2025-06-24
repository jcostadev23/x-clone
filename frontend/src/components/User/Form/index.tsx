"use cliente";

import { useAppContext } from "@/hooks/useAppContext";
import { User } from "@/types";
import { postUser } from "@/app/utils/apiCalls";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import xIcon from "../../../../public/x-logo.png";
import Button from "../../Button";
import Input from "../../Form/Input";

type Props = {
  handleClose: (value: boolean) => void;
};

const UserForm: React.FC<Props> = ({ handleClose }) => {
  const { setIsLoading } = useAppContext();
  const [user, setUser] = useState<User>({
    email: "",
    userName: "",
    birthDate: "",
    passwordHash: "",
  });

  const onSubmit = useCallback(async () => {
    handleClose(false);
    setIsLoading(true);
    await postUser(user);
    setIsLoading(false);
  }, [handleClose, setIsLoading, user]);

  return (
    <>
      <form>
        <div className="flex flex-col items-center gap-3 text-black">
          <Image height={30} width={30} alt="x image" src={xIcon} />
          <h3>Create your account</h3>
        </div>
        <div className="flex flex-col gap-2 px-4 py-4">
          <Input
            label="Name"
            form={true}
            value={user.userName}
            onChange={(value) =>
              setUser((prev) => ({ ...prev, userName: value }))
            }
          />
          <Input
            label="Email"
            type="email"
            form={true}
            value={user.email}
            onChange={(value) => setUser((prev) => ({ ...prev, email: value }))}
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
          <Input
            label="Date of birth"
            type="date"
            form={true}
            value={user.birthDate}
            onChange={(value) =>
              setUser((prev) => ({ ...prev, birthDate: value }))
            }
          />
        </div>
        <Button
          className="py-2 px-4 m-4 "
          backgroundColor="secondary"
          label="Submit"
          onClick={onSubmit}
          applyMinWidth
        />
      </form>
    </>
  );
};

export default UserForm;
