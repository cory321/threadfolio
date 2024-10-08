'use client'

import { useState } from 'react'

import dynamic from 'next/dynamic'

const SettingsNavbar = dynamic(() => import('@components/settings/SettingsNavbar'))

const tabComponents = [
  dynamic(() => import('@components/settings/AccountInfo')),
  dynamic(() => import('@components/settings/CompanyBrand')),
  dynamic(() => import('@components/settings/Preferences')),
  dynamic(() => import('@components/settings/Membership')),
  dynamic(() => import('@components/settings/BankDetails')),
  dynamic(() => import('@components/settings/ClientPaymentMethods'))
]

export default function SettingsContent() {
  const [selectedTab, setSelectedTab] = useState(0)

  const TabContent = tabComponents[selectedTab]

  return (
    <>
      <SettingsNavbar value={selectedTab} onChange={(e, val) => setSelectedTab(val)} />
      <div className='p-6'>
        <TabContent />
      </div>
    </>
  )
}
