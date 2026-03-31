// app/layout.tsx
import './globals.css'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import TopLoader from '@/components/layout/TopLoader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
