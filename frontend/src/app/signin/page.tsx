"use client";

import Loading from "@/components/Loader";
import Modal from "@/components/Modal";
import UserForm from "@/components/User/Form";
import SignInForm from "@/components/User/SignInForm";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "../../hooks/useAppContext";
import xIcon from "../../public/x-logo.png";

const XLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SignIn = () => {
  const { isLoading } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);

  return (
    <>
      {isLoading && <Loading />}

      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left — blue panel with big X */}
        <div className="hidden md:flex flex-1 bg-[#1D9BF0] items-center justify-center">
          <div className="w-72 h-72 text-white">
            <XLogo />
          </div>
        </div>

        {/* Mobile X logo */}
        <div className="flex md:hidden justify-center pt-10">
          <Image width={40} height={40} alt="X logo" src={xIcon} />
        </div>

        {/* Right — auth content */}
        <div className="flex flex-1 items-center justify-center px-8 py-12">
          <div className="w-full max-w-[400px]">
            {/* Desktop X logo */}
            <div className="hidden md:block mb-10">
              <div className="w-10 h-10 text-[#0F1419]">
                <XLogo />
              </div>
            </div>

            <h1 className="text-[40px] md:text-[64px] font-extrabold text-[#0F1419] leading-none mb-8">
              Happening now
            </h1>
            <h2 className="text-[23px] md:text-[31px] font-extrabold text-[#0F1419] mb-8">
              Join today.
            </h2>

            {/* Social auth (visual only) */}
            <button className="w-full flex items-center justify-center gap-3 border border-[#EFF3F4] rounded-full py-2.5 mb-3 hover:bg-[#E7E7E8] transition-colors font-medium text-[#0F1419] text-[15px]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </button>

            <button className="w-full flex items-center justify-center gap-3 border border-[#EFF3F4] rounded-full py-2.5 mb-4 hover:bg-[#E7E7E8] transition-colors font-medium text-[#0F1419] text-[15px]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.086 14.904l-3.47-3.47 1.06-1.06 2.41 2.41 5.158-5.158 1.06 1.06-6.218 6.218z" />
              </svg>
              Sign up with Apple
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 border-t border-[#EFF3F4]" />
              <span className="text-[#536471] text-[15px]">or</span>
              <div className="flex-1 border-t border-[#EFF3F4]" />
            </div>

            {/* Create account */}
            <button
              onClick={() => setIsOpen(true)}
              className="w-full bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold rounded-full py-2.5 mb-3 transition-colors text-[17px]"
            >
              Create account
            </button>

            <p className="text-[#536471] text-[11px] mb-10">
              By signing up, you agree to the{" "}
              <span className="text-[#1D9BF0] hover:underline cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="text-[#1D9BF0] hover:underline cursor-pointer">Privacy Policy</span>
              , including{" "}
              <span className="text-[#1D9BF0] hover:underline cursor-pointer">Cookie Use</span>.
            </p>

            {/* Sign in */}
            <p className="font-bold text-[17px] text-[#0F1419] mb-5">
              Already have an account?
            </p>
            <button
              onClick={() => setIsSignIn(true)}
              className="w-full border border-[#1D9BF0] text-[#1D9BF0] font-bold rounded-full py-2.5 hover:bg-[#1D9BF0]/10 transition-colors text-[17px]"
            >
              Sign in
            </button>
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
