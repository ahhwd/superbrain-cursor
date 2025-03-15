"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { prisma } from "@/lib/prisma";
import { useTranslation } from "@/lib/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AccountPage() {
  const { data: session } = useSession();
  const [monthlyCaptures, setMonthlyCaptures] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchUsageData() {
      if (session?.user?.email) {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch('/api/account/usage');
          if (response.ok) {
            const data = await response.json();
            setMonthlyCaptures(data.monthlyCaptures);
          } else {
            setError(t('error_loading_usage'));
          }
        } catch (error) {
          console.error(t('error_loading_usage_detail') + ":", error);
          setError(t('error_loading_usage_detail'));
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUsageData();
  }, [session, t]);

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-900">{t('account_title')}</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {t('account_description')}
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">{t('profile_title')}</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">{t('profile_email')}</p>
            <p className="text-sm sm:text-base">{session?.user?.email}</p>
          </div>
          
          <div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">{t('profile_name')}</p>
            <p className="text-sm sm:text-base">{session?.user?.name || t('profile_not_set')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">{t('usage_title')}</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">{t('usage_monthly_captures')}</p>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                <p className="text-sm sm:text-base text-gray-500">{t('loading')}</p>
              </div>
            ) : error ? (
              <p className="text-sm sm:text-base text-red-500">{error}</p>
            ) : (
              <p className="text-sm sm:text-base font-semibold">{monthlyCaptures} {t('usage_pages')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">{t('language_title')}</h2>
        
        <div className="space-y-4">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">{t('account_section_title')}</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled
            >
              {t('upgrade_pro')}
            </button>
            <span className="ml-3 text-sm text-gray-500 italic">{t('coming_soon')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}