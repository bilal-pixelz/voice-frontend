'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY
      if (currentY > lastY.current && currentY > 50) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transform transition-transform duration-300 bg-slate-900/80 backdrop-blur border-b border-slate-800 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">
                V
              </div>
              <div className="hidden sm:block text-white font-semibold">
                <span className="text-sky-400">Voice</span> 2 Invoice
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-slate-300">
              <button className="p-2 rounded-md hover:bg-slate-800">?
              </button>
              <button className="p-2 rounded-md hover:bg-slate-800">☀️
              </button>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((s) => !s)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 text-sm text-white"
                aria-expanded={open}
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-xs font-semibold text-slate-900">JD</span>
                <span className="hidden sm:inline">Account</span>
                <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.657a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-800 rounded-md shadow-lg py-1 overflow-hidden">
                  <Link href="/dashboard/settings/profile" className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">Profile</Link>
                  <Link href="/api/auth/logout" className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">Sign out</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
