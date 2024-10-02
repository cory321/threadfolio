import Link from 'next/link'

export default function LandingPage() {
  return (
    <div>
      <header>
        <nav>
          <Link href='/login'>Login</Link>
          <Link href='/register'>Register</Link>
        </nav>
      </header>
      <main>
        <h1>Welcome to Your App</h1>
        <p>This is the public landing page accessible by everyone.</p>
      </main>
    </div>
  )
}
