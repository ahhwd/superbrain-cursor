"use client";

import { useSession } from "next-auth/react";

export default function HighlightsPage() {
  const { data: session } = useSession();

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">精華筆記</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          此頁面將顯示您標記為精華的筆記內容。
        </p>
      </div>
    </div>
  );
} 