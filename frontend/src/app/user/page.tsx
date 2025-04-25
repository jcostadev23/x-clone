"use client";

import Image from "next/image";
import { useState } from "react";
import xIcon from "../../public/x-logo.png";
import Button from "../components/Button";
import Modal from "../components/Modal";
import UserForm from "../components/User/Form";

const UserPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center justify-evenly h-full w-full">
      <Image width={300} height={300} alt="x image" src={xIcon} />
      <div className="flex items-center">
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setIsOpen(true)}
            label="Create account"
          ></Button>
          <Button
            onClick={() => setIsOpen(true)}
            label="Sign in"
            backgroundColor="secondary"
          ></Button>
        </div>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <UserForm></UserForm>
        </Modal>
      </div>
    </div>
  );
};

export default UserPage;
