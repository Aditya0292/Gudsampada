import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AdminLayoutShell from '@/components/admin/AdminLayoutShell'

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
    <AdminLayoutShell userEmail={user?.email || undefined}>
      {children}
    </AdminLayoutShell>
  )
}

