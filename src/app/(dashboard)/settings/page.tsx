import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium">User ID</p>
            <p className="text-sm text-gray-600 font-mono text-xs">{user?.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
