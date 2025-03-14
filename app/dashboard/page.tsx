import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

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
      </div>
    </div>
  );
} 