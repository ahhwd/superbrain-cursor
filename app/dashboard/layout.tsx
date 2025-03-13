"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });

  if (status === "loading") {
    return <div>載入中...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 hidden md:block">
        <Sidebar className="h-screen sticky top-0" />
      </div>
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        {children}
      </div>
    </div>
  );
} 