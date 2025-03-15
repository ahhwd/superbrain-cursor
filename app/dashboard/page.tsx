<<<<<<< HEAD
import { auth } from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">儀表板</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="mb-4">歡迎回來，{session.user?.name}！</p>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">個人資訊</h2>
            <p>電子郵件：{session.user?.email}</p>
          </div>
        </div>
=======
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useTranslation();

  const menuItems = [
    { 
      name: t('dashboard_highlights_card'), 
      href: '/dashboard/highlights', 
      icon: 'star', 
      description: t('dashboard_highlights_description') 
    },
    { 
      name: t('dashboard_capture_card'), 
      href: '/dashboard/capture', 
      icon: 'capture', 
      description: t('dashboard_capture_description') 
    },
  ];

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-900">{t('dashboard_welcome_title')}</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {t('dashboard_welcome_description')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="bg-white shadow-lg rounded-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-3">
              {item.icon === 'capture' && (
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              )}
              {item.icon === 'star' && (
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              )}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{item.name}</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">{item.description}</p>
          </Link>
        ))}
>>>>>>> 1ba8565bb22671d515ea43969547997ad723e12c
      </div>
    </div>
  );
} 