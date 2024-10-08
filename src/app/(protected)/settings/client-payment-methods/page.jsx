// src/app/(protected)/settings/client-payment-methods/page.jsx

import ClientPaymentMethods from '@components/settings/ClientPaymentMethods'

export const metadata = {
  title: 'Client Payment Methods - Settings'
}

export default function ClientPaymentMethodsPage() {
  return (
    <div>
      <ClientPaymentMethods />
    </div>
  )
}
