'use client'
import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
        <Toaster />
      </body>
    </html>
  )
}
