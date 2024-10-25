import InvoiceList from '@/app/apps/invoice/list'
import { getInvoiceData } from '@/app/actions/invoice'
import SmsForm from './_components/SmsForm'

export default async function FinancePage() {
  const data = await getInvoiceData()

  return (
    <div>
      <h1>Invoices</h1>
      <InvoiceList invoiceData={data} />
      {/* <SmsForm /> */}
    </div>
  )
}
