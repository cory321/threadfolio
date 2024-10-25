// Next Imports
import { redirect } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import EditCard from '@/app/apps/invoice/edit/EditCard'
import EditActions from '@/app/apps/invoice/edit/EditActions'

// Data Imports
import { getInvoiceData } from '@/app/actions/invoice'

const EditPage = async ({ params }) => {
  // Vars
  const data = await getInvoiceData()
  const filteredData = data?.filter(invoice => invoice.id === params.id)[0]

  if (!filteredData) {
    redirect('/not-found')
  }

  return filteredData ? (
    <Grid container spacing={6}>
      <Grid item xs={12} md={9}>
        <EditCard data={data} invoiceData={filteredData} id={params.id} />
      </Grid>
      <Grid item xs={12} md={3}>
        <EditActions id={params.id} />
      </Grid>
    </Grid>
  ) : null
}

export default EditPage
