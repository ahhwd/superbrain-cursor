"use client";

import { useSession } from "next-auth/react";

export default function HighlightsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">精華筆記</h1>
        <p className="text-gray-600">
          此頁面將顯示您標記為精華的筆記內容。
        </p>
      </div>
    </div>
  );
} 