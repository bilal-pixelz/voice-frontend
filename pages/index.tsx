import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'

export default function Home() {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <main style={{ padding: 32 }}>
      <h1>Voice2Invoice</h1>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <Link href="/api/auth/logout">Logout</Link>
        </>
      ) : (
        <Link href="/api/auth/login">Login with Auth0</Link>
      )}
    </main>
  )
}
