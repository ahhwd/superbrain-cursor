import React from "react";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            註冊 SuperBrain
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            已經有帳號？{" "}
            <a
              href="/auth/signin"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              登入
            </a>
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
} 