"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function DashboardNav({ email }: { email?: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/dashboard" className="font-semibold text-xl">
          App
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-gray-600">{email}</span>
          <Link href="/settings">
            <Button variant="ghost" size="sm">Settings</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  )
}
