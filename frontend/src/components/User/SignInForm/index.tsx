"use client";

import { useAppContext } from "@/hooks/useAppContext";
import xIcon from "@/public/x-logo.png";
import { signIn } from "@/utils/apiCalls";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import Button from "../../Button";
import Input from "../../Form/Input";

type Props = {
  handleClose: (value: boolean) => void;
};

const SignInForm: React.FC<Props> = ({ handleClose }) => {
  const { startLoading, stopLoading } = useAppContext();
  const router = useRouter();
  const [user, setUser] = useState({ userName: "", password: "" });

  const onSubmit = useCallback(async () => {
    startLoading();
    const response = await signIn(user);
    stopLoading();
    handleClose(false);

    if (response?.success) {
      router.push("/");
      router.refresh();
    }
  }, [handleClose, startLoading, stopLoading, user, router]);

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
            onChange={(value) => setUser((prev) => ({ ...prev, userName: value }))}
          />
          <Input
            label="Password"
            type="password"
            form={true}
            value={user.password}
            onChange={(value) => setUser((prev) => ({ ...prev, password: value }))}
          />
        </div>
        <Button
          className="py-2 px-4 m-4"
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
