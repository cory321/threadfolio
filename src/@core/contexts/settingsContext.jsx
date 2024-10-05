'use client'
import React, { createContext, useState } from 'react'

// Config Imports
import themeConfig from '@configs/themeConfig'
import primaryColorConfig from '@configs/primaryColorConfig'

// Initial Settings Context
export const SettingsContext = createContext(null)

// Settings Provider
export const SettingsProvider = ({ children }) => {
  // Initial Settings
  const initialSettings = {
    mode: themeConfig.mode,
    skin: themeConfig.skin,
    semiDark: themeConfig.semiDark,
    layout: themeConfig.layout,
    navbarContentWidth: themeConfig.navbar.contentWidth,
    contentWidth: themeConfig.contentWidth,
    footerContentWidth: themeConfig.footer.contentWidth,
    primaryColor: primaryColorConfig[0].main
  }

  const [settings, setSettings] = useState(initialSettings)

  const updateSettings = updatedSettings => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...updatedSettings
    }))
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}
