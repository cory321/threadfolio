import { Grid, Box, Button, Typography } from '@mui/material'
import { CldImage } from 'next-cloudinary'

import AddGarmentButton from '@components/garments/AddGarmentButton'
import GarmentDetailsDialog from '@components/garments/GarmentDetailsDialog'
import { getFirstName } from '@components/garments/utils/garmentUtils'

const Step2GarmentDetails = ({
  userId,
  selectedClient,
  garmentDetails,
  setGarmentDetails,
  garments,
  handleGarmentSubmit,
  handleInputChange,
  handleGarmentSave,
  handleDialogOpen,
  handleDialogClose,
  dialogOpen,
  isLoading,
  handleBack,
  onSubmit
}) => (
  <>
    <form key={1} onSubmit={handleGarmentSubmit(onSubmit)}>
      <h2>Add Garments {selectedClient.full_name && `for ${getFirstName(selectedClient.full_name)}`} </h2>
      <Grid container sx={{ pt: 10, pb: 10 }}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item>
              <AddGarmentButton btnText='Add Garment' handleClickOpen={handleDialogOpen} />
            </Grid>
            {garments.length > 0 &&
              garments.map((garment, index) => (
                <Grid item key={index}>
                  {garment.image_cloud_id ? (
                    <CldImage
                      src={garment.image_cloud_id}
                      alt={garment.name}
                      width={150}
                      height={150}
                      crop='fill'
                      quality='auto'
                      fetchformat='auto'
                      style={{ borderRadius: '10px', transition: '0.3s' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 150,
                        height: 150,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid grey',
                        borderRadius: '10px'
                      }}
                    >
                      <i className='ri-t-shirt-line' style={{ fontSize: '2rem', color: 'grey' }} />
                    </Box>
                  )}
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
      garmentDetails={garmentDetails}
      setGarmentDetails={setGarmentDetails}
      handleInputChange={handleInputChange}
      handleGarmentSave={handleGarmentSave}
      isLoading={isLoading}
    />
  </>
)

export default Step2GarmentDetails
