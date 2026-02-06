import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight">
          Your App Template
        </h1>
        <p className="text-xl text-gray-600">
          A production-ready Next.js + Supabase starter with authentication,
          dashboard, and more.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
        <div className="pt-8 text-sm text-gray-500">
          <p>Built with Next.js, Supabase, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}
