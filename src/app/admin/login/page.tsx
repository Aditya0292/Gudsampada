'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage(): React.JSX.Element {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    try {
      const cleanEmail = email.trim().toLowerCase()

      // 1. Check custom admin credentials
      if (cleanEmail === 'adityahavaldar07@gmail.com' && password === 'Aditya2005') {
        document.cookie = 'admin_session=true; path=/; max-age=604800; SameSite=Lax'
        router.push('/admin')
        router.refresh()
        return
      }

      // 2. Fallback to Supabase Auth
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        setErrorMessage('Invalid admin email or password')
      } else if (data.session) {
        document.cookie = 'admin_session=true; path=/; max-age=604800; SameSite=Lax'
        router.push('/admin')
        router.refresh()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred'
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Background Dot Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1C1C1A 0.5px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-md bg-white border border-[#1C1C1A]/15 rounded-none p-6 sm:p-10 shadow-xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 bg-[#1C1C1A] text-gold font-sans font-bold text-[9px] uppercase tracking-[0.25em] rounded-none">
            Admin Portal
          </span>
          <h1 className="font-heading text-3xl font-bold text-[#1C1C1A]">
            gud<span className="italic font-normal text-gold">sampada.</span>
          </h1>
          <p className="font-sans text-xs text-molasses/60">
            Sign in to manage orders, products & enquiries
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-terracotta/10 border border-terracotta/40 text-terracotta text-xs font-sans text-center rounded-none">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gudsampada.com"
              className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-4 text-sm font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none shadow-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C7A6B] mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-11 bg-[#F9F6F0] border border-[#1C1C1A]/20 px-4 text-sm font-sans text-[#1C1C1A] focus:outline-none focus:border-gold rounded-none shadow-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#1C1C1A] hover:bg-gold text-[#F9F6F0] hover:text-[#1C1C1A] font-sans font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 rounded-none cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <span>Sign In to Dashboard →</span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#1C1C1A]/10 text-center">
          <a
            href="/"
            className="text-[11px] font-sans text-molasses/50 hover:text-gold transition-colors underline underline-offset-4"
          >
            ← Back to Storefront
          </a>
        </div>
      </div>
    </main>
  )
}
