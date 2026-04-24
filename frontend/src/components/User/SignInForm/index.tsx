"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { signIn } from "@/utils/apiCalls";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

type Props = {
  handleClose: (value: boolean) => void;
};

const SignInForm: React.FC<Props> = ({ handleClose }) => {
  const { startLoading, stopLoading } = useAppContext();
  const router = useRouter();
  const [user, setUser] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startLoading();
    const response = await signIn(user);
    stopLoading();

    if (!response?.success) {
      setError("Invalid username or password.");
      return;
    }

    handleClose(false);
    router.push("/");
    router.refresh();
  }, [handleClose, startLoading, stopLoading, user, router]);

  return (
    <form onSubmit={onSubmit} className="px-10 pb-10 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-[31px] font-extrabold text-[#0F1419]">Sign in to X</h2>
      </div>

      {error && (
        <p className="text-rose-500 text-[15px] text-center">{error}</p>
      )}

      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={user.userName}
            onChange={(e) => setUser((p) => ({ ...p, userName: e.target.value }))}
            placeholder="Username"
            className="w-full border border-[#CFD9DE] rounded-md px-3 pt-5 pb-2 text-[17px] text-[#0F1419] outline-none focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0] transition-all peer"
            required
          />
        </div>

        <div className="relative">
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser((p) => ({ ...p, password: e.target.value }))}
            placeholder="Password"
            className="w-full border border-[#CFD9DE] rounded-md px-3 pt-5 pb-2 text-[17px] text-[#0F1419] outline-none focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0] transition-all"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!user.userName || !user.password}
        className="w-full bg-[#0F1419] hover:bg-[#272C30] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-full py-3 text-[17px] transition-colors"
      >
        Sign in
      </button>
    </form>
  );
};

export default SignInForm;
