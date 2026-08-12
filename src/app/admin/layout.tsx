import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AdminHeader from './AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-cream text-molasses flex flex-col font-sans">
      <AdminHeader userEmail={user?.email} />
      <div className="flex-1 w-full">{children}</div>
    </div>
  )
}
