'use server'

// Next Imports
import { cookies, headers } from 'next/headers'

// Config Imports
import themeConfig from '@configs/themeConfig'
import demoConfigs from '@configs/demoConfigs'

export const getDemoName = () => {
  const headersList = headers()
  const demoName = headersList.get('X-server-header')

  return demoName
}

export const getSettingsFromCookie = () => {
  try {
    const cookieStore = cookies()
    const demoName = getDemoName()

    const cookieName = demoName
      ? themeConfig.settingsCookieName.replace('demo-1', demoName)
      : themeConfig.settingsCookieName

    return JSON.parse(cookieStore.get(cookieName)?.value || '{}')
  } catch (error) {
    // Return default settings if cookies() cannot be called
    return {}
  }
}

export const getMode = () => {
  const settingsCookie = getSettingsFromCookie()
  const demoName = getDemoName()

  // Get mode from cookie or fallback to theme config
  const _mode =
    settingsCookie.mode || (demoName && demoConfigs[demoName] && demoConfigs[demoName].mode) || themeConfig.mode

  return _mode
}

export const getSystemMode = () => {
  const cookieStore = cookies()
  const mode = getMode()
  const colorPrefCookie = cookieStore.get('colorPref')?.value || 'light'

  return (mode === 'system' ? colorPrefCookie : mode) || 'light'
}

export const getServerMode = () => {
  const mode = getMode()
  const systemMode = getSystemMode()

  return mode === 'system' ? systemMode : mode
}

export const getSkin = () => {
  const settingsCookie = getSettingsFromCookie()

  return settingsCookie.skin || 'default'
}
