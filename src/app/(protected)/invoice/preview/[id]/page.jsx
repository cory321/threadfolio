// Next Imports
import { redirect } from 'next/navigation'

// Component Imports
import Preview from '@/app/apps/invoice/preview'

// Data Imports
import { getInvoiceData } from '@/app/actions/invoice'

const PreviewPage = async ({ params }) => {
  // Vars
  const data = await getInvoiceData()
  const filteredData = data?.filter(invoice => invoice.id === params.id)[0]

  if (!filteredData) {
    redirect('/not-found')
  }

  return filteredData ? <Preview invoiceData={filteredData} id={params.id} /> : null
}

export default PreviewPage
