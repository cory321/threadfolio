import React, { useContext } from 'react'

import { Grid, Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material'

import OrderFlowGarmentCard from '@components/orders/OrderFlowGarmentCard'

import AddGarmentButton from '@components/garments/AddGarmentButton'
import GarmentDetailsDialog from '@components/garments/GarmentDetailsDialog'
import { getFirstName } from '@components/garments/utils/garmentUtils'
import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'

const Step2GarmentDetails = ({
  userId,
  selectedClient,
  handleGarmentSubmit,
  handleInputChange,
  handleDialogOpen,
  handleDialogClose,
  dialogOpen,
  isLoading,
  handleBack,
  onSubmit
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { garments, setGarmentDetails, addOrUpdateGarment } = useContext(GarmentServiceOrderContext)

  const handleGarmentEdit = garment => {
    setGarmentDetails({ ...garment })
    handleDialogOpen()
  }

  const handleAddNewGarment = () => {
    setGarmentDetails({
      id: null,
      name: '',
      instructions: '',
      due_date: null,
      is_event: false,
      event_date: null,
      image_cloud_id: '',
      image_metadata: { width: 0, height: 0 },
      services: []
    }) // Reset garment details for new garment
    handleDialogOpen()
  }

  // Determine if the AddGarmentButton should be full width
  const shouldFullWidth = isMobile

  return (
    <>
      <form key={1} onSubmit={handleGarmentSubmit(onSubmit)}>
        <Typography variant='h5' gutterBottom>
          Add Garments {selectedClient.full_name && `for ${getFirstName(selectedClient.full_name)}`}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent={'center'}>
              <Grid item xs={shouldFullWidth ? 12 : 'auto'}>
                <AddGarmentButton
                  btnText='Add Garment'
                  handleClickOpen={handleAddNewGarment}
                  fullWidth={shouldFullWidth}
                />
              </Grid>
              {garments.length > 0 && (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {garments.map((garment, index) => (
                      <Grid item xs={12} sm={6} md={4} key={garment.id || index}>
                        <OrderFlowGarmentCard garment={garment} onEdit={() => handleGarmentEdit(garment)} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Button variant='outlined' onClick={handleBack} color='secondary'>
              Back
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' type='submit'>
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
      <GarmentDetailsDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        userId={userId}
        selectedClient={selectedClient}
        handleInputChange={handleInputChange}
        isLoading={isLoading}

        // Removed onSubmit prop as it's now handled within the dialog
      />
    </>
  )
}

export default Step2GarmentDetails
