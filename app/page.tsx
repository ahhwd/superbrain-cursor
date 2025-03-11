export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">歡迎來到 SuperBrain</h1>
        <p className="text-xl mb-4">您的個人知識管理助手</p>
        <div className="mt-8">
          <a href="/auth/signin" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            登入
          </a>
          <a href="/auth/register" className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            註冊
          </a>
        </div>
      </div>
    </main>
  )
} 