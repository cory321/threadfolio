// Context Imports
import { ClerkProvider } from '@clerk/nextjs'

import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Styled Component Imports
import AppReactToastify from '@/libs/styles/AppReactToastify'

// Util Imports
import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

const primaryColor = '#8C57FF'

const appearance = {
  variables: {
    colorPrimary: primaryColor
  }
}

const Providers = props => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const demoName = getDemoName()
  const systemMode = getSystemMode()

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl='/login'
      signUpUrl='/register'
      signInFallbackRedirectUrl='/dashboard'
      signUpFallbackRedirectUrl='/onboarding'
      appearance={appearance}
    >
      <VerticalNavProvider>
        <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
          <ThemeProvider direction={direction} systemMode={systemMode}>
            {children}
            <AppReactToastify position={themeConfig.toastPosition} hideProgressBar rtl={direction === 'rtl'} />
          </ThemeProvider>
        </SettingsProvider>
      </VerticalNavProvider>
    </ClerkProvider>
  )
}

export default Providers
