import React, { useContext } from 'react'

import { Grid, Box, Button, Typography } from '@mui/material'
import { CldImage } from 'next-cloudinary'

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
  const { garments, setGarmentDetails } = useContext(GarmentServiceOrderContext)

  const handleGarmentEdit = index => {
    setGarmentDetails({ ...garments[index], index })
    handleDialogOpen()
  }

  const handleAddNewGarment = () => {
    setGarmentDetails({}) // Clear garment details when adding a new garment
    handleDialogOpen()
  }

  return (
    <>
      <form key={1} onSubmit={handleGarmentSubmit(onSubmit)}>
        <h2>Add Garments {selectedClient.full_name && `for ${getFirstName(selectedClient.full_name)}`} </h2>
        <Grid container sx={{ pt: 10, pb: 10 }}>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item>
                <AddGarmentButton btnText='Add Garment' handleClickOpen={handleAddNewGarment} />
              </Grid>
              {garments.length > 0 &&
                garments.map((garment, index) => (
                  <Grid item key={index}>
                    <Button onClick={() => handleGarmentEdit(index)} style={{ padding: 0, minWidth: 'auto' }}>
                      {garment.image_cloud_id ? (
                        <Box
                          sx={{
                            borderRadius: '10px',
                            overflow: 'hidden', // This ensures the image respects the border radius
                            transition: '0.3s',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                            }
                          }}
                        >
                          <CldImage
                            src={garment.image_cloud_id}
                            alt={garment.name}
                            width={150}
                            height={150}
                            crop='fill'
                            quality='auto'
                            fetchformat='auto'
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: 150,
                            height: 150,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid grey',
                            borderRadius: '10px',
                            transition: '0.3s',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                        >
                          <i className='ri-t-shirt-line' style={{ fontSize: '2rem', color: 'grey' }} />
                        </Box>
                      )}
                    </Button>
                    <Typography variant='h6' align='center'>
                      {garment.name}
                    </Typography>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={6}>
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
      />
    </>
  )
}

export default Step2GarmentDetails
