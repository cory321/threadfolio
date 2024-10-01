import { Box, Typography } from '@mui/material'
import { CldImage } from 'next-cloudinary'

const GarmentImage = ({ garment }) => {
  return (
    <>
      <Typography variant='h4' gutterBottom sx={{ mt: 2, textAlign: 'center' }}>
        {garment.name}
      </Typography>
      {garment.image_cloud_id ? (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '100%', // Maintains aspect ratio
            overflow: 'hidden'
          }}
        >
          <CldImage
            src={garment.image_cloud_id}
            alt={garment.name}
            fill
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 600px) 100vw, 600px'
          />
        </Box>
      ) : (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'grey.200'
          }}
        >
          <i
            className='ri-t-shirt-line'
            style={{
              fontSize: '5rem',
              color: 'grey',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </Box>
      )}
    </>
  )
}

export default GarmentImage
