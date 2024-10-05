import { ClerkProvider } from '@clerk/nextjs'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Threadfolio - An app for seamstresses and tailors!',
  description: 'Threadfolio is an app for seamstresses and tailors to manage their clients, projects, and more!'
}

const RootLayout = ({ children }) => {
  // Vars
  const direction = 'ltr'

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl='/login'
      signUpUrl='/register'
      signInFallbackRedirectUrl='/dashboard'
      signUpFallbackRedirectUrl='/onboarding'
    >
      <html id='__next' lang='en' dir={direction}>
        <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
      </html>
    </ClerkProvider>
  )
}

export default RootLayout
