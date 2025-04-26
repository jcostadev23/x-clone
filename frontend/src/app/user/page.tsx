"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import xIcon from "../../public/x-logo.png";
import Button from "../components/Button";
import Loading from "../components/Loader";
import Modal from "../components/Modal";
import UserForm from "../components/User/Form";
import { useAppContext } from "../hooks/useAppContext";

const UserPage = () => {
  const { isLoading } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isLoading && <Loading />}
      <div
        className={clsx(
          "flex items-center justify-evenly h-full w-full",
          isOpen && "opacity-70 bg-gray-50"
        )}
      >
        <Image width={300} height={300} alt="x image" src={xIcon} />
        <div className="flex items-center">
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setIsOpen(true)}
              label="Create account"
            ></Button>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <UserForm handleClose={setIsOpen} />
      </Modal>
    </>
  );
};

export default UserPage;
