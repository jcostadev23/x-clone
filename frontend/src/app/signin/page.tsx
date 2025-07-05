"use client";

import Button from "@/components/Button";
import Loading from "@/components/Loader";
import Modal from "@/components/Modal";
import UserForm from "@/components/User/Form";
import SignInForm from "@/components/User/SignInForm";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAppContext } from "../../hooks/useAppContext";
import xIcon from "../../public/x-logo.png";

const SignIn = () => {
  const { isLoading } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);

  return (
    <>
      {isLoading && <Loading />}
      <div
        className={clsx(
          "flex items-center justify-evenly h-full w-full",
          isOpen && "opacity-70 bg-gray-50"
        )}
      >
        <Link href="/">
          <Image width={300} height={300} alt="x image" src={xIcon} />
        </Link>
        <div className="flex items-center">
          <div className="flex flex-col gap-2">
            <Button onClick={() => setIsOpen(true)} label="Create account" />
            <Button
              onClick={() => setIsSignIn(true)}
              label="Sign in"
              backgroundColor="secondary"
            />
          </div>
        </div>
      </div>
      <Modal isOpen={isSignIn} onClose={() => setIsSignIn(false)}>
        <SignInForm handleClose={setIsSignIn} />
      </Modal>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <UserForm handleClose={setIsOpen} />
      </Modal>
    </>
  );
};

export default SignIn;
