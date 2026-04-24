"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { postUser } from "@/utils/apiCalls";
import React, { useCallback, useState } from "react";

type Props = {
  handleClose: (value: boolean) => void;
};

const UserForm: React.FC<Props> = ({ handleClose }) => {
  const { startLoading, stopLoading } = useAppContext();
  const [user, setUser] = useState({ email: "", userName: "", birthDate: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startLoading();
    const response = await postUser(user);
    stopLoading();

    if (!response?.success) {
      setError(response ? "Username or email already in use." : "Something went wrong. Try again.");
      return;
    }

    handleClose(false);
    window.location.replace("/");
  }, [handleClose, startLoading, stopLoading, user]);

  const fields = [
    { key: "userName" as const, label: "Username", type: "text" },
    { key: "email" as const, label: "Email", type: "email" },
    { key: "password" as const, label: "Password", type: "password" },
    { key: "birthDate" as const, label: "Date of birth", type: "date" },
  ];

  return (
    <form onSubmit={onSubmit} className="px-10 pb-10 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-[31px] font-extrabold text-[#0F1419]">Create your account</h2>
      </div>

      {error && (
        <p className="text-rose-500 text-[15px] text-center">{error}</p>
      )}

      <div className="flex flex-col gap-4">
        {fields.map(({ key, label, type }) => (
          <input
            key={key}
            type={type}
            value={user[key]}
            onChange={(e) => setUser((p) => ({ ...p, [key]: e.target.value }))}
            placeholder={label}
            className="w-full border border-[#CFD9DE] rounded-md px-3 py-3 text-[17px] text-[#0F1419] placeholder-[#536471] outline-none focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0] transition-all"
            required
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={Object.values(user).some((v) => !v)}
        className="w-full bg-[#0F1419] hover:bg-[#272C30] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-full py-3 text-[17px] transition-colors"
      >
        Create account
      </button>
    </form>
  );
};

export default UserForm;
