// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import AddCard from '@/app/apps/invoice/add/AddCard'
import AddActions from '@/app/apps/invoice/add/AddActions'

// Data Imports
import { getInvoiceData } from '@/app/actions/invoice'

export default async function InvoiceAddPage() {
  const data = await getInvoiceData()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={9}>
        <AddCard invoiceData={data} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AddActions />
      </Grid>
    </Grid>
  )
}
