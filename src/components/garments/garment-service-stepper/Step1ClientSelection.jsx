import { Grid, Button } from '@mui/material'

import GarmentClientLookup from '@components/garments/GarmentClientLookup'

const Step1ClientSelection = ({ userId, selectedClient, setSelectedClient, handleClientSubmit, onSubmit }) => (
  <form key={0} onSubmit={handleClientSubmit(onSubmit)}>
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <GarmentClientLookup userId={userId} onClientSelect={setSelectedClient} selectedClient={selectedClient} />
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='contained' type='submit' disabled={!selectedClient}>
          Next
        </Button>
      </Grid>
    </Grid>
  </form>
)

export default Step1ClientSelection
