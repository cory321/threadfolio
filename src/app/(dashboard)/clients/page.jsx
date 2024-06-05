import React from 'react'

import dynamic from 'next/dynamic'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

const ClientDashboard = dynamic(() => import('@/components/clients/ClientDashboard'), {
  ssr: false,
  loading: LoadingSpinner
})

export default function ClientsPage() {
  return (
    <div>
      <ClientDashboard />
    </div>
  )
}
