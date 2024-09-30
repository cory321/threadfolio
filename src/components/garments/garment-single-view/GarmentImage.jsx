import { Box, Typography } from '@mui/material'
import { CldImage } from 'next-cloudinary'

const GarmentImage = ({ garment }) => {
  return (
    <>
      <Typography variant='h4' gutterBottom sx={{ mt: 2, textAlign: 'center' }}>
        {garment.name}
      </Typography>
      {garment.image_cloud_id ? (
        <CldImage src={garment.image_cloud_id} alt={garment.name} width={300} height={300} crop='fill' />
      ) : (
        <Box
          sx={{
            width: 300,
            height: 300,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'grey.200'
          }}
        >
          <i className='ri-t-shirt-line' style={{ fontSize: '5rem', color: 'grey' }} />
        </Box>
      )}
    </>
  )
}

export default GarmentImage
