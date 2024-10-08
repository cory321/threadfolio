'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

import { Tabs, Tab, Select, MenuItem, useMediaQuery } from '@mui/material'

const SettingsNavbar = () => {
  const isMobile = useMediaQuery('(max-width:600px)')
  const pathname = usePathname()
  const router = useRouter()

  const tabs = [
    { label: 'Account Info', path: '/settings/account-info' },
    { label: 'Company Brand', path: '/settings/company-brand' },
    { label: 'Preferences', path: '/settings/preferences' },
    { label: 'Membership', path: '/settings/membership' },
    { label: 'Bank Details', path: '/settings/bank-details' },
    { label: 'Client Payment Methods', path: '/settings/client-payment-methods' }
  ]

  const currentTab = tabs.findIndex(tab => pathname.startsWith(tab.path))

  if (isMobile) {
    const handleSelectChange = event => {
      const selectedTab = tabs[event.target.value]

      router.push(selectedTab.path)
    }

    return (
      <Select
        value={currentTab >= 0 ? currentTab : 0}
        onChange={handleSelectChange}
        fullWidth
        variant='outlined'
        sx={{ mb: 2 }}
      >
        {tabs.map((tab, index) => (
          <MenuItem key={tab.path} value={index}>
            {tab.label}
          </MenuItem>
        ))}
      </Select>
    )
  }

  return (
    <Tabs
      value={currentTab >= 0 ? currentTab : 0}
      variant='scrollable'
      scrollButtons='auto'
      aria-label='settings tabs'
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      {tabs.map(tab => (
        <Tab key={tab.path} label={tab.label} component={Link} href={tab.path} />
      ))}
    </Tabs>
  )
}

export default SettingsNavbar
