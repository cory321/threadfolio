// src/app/(protected)/settings/layout.jsx

import dynamic from 'next/dynamic'

const SettingsNavbar = dynamic(() => import('@/components/settings/SettingsNavbar'), { ssr: false })

export default function SettingsLayout({ children }) {
  return (
    <div className='flex flex-col'>
      <SettingsNavbar />
      <div className='p-6'>{children}</div>
    </div>
  )
}
