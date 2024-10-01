import { useState } from 'react'

import { Box, Typography, CircularProgress } from '@mui/material'
import { CldImage } from 'next-cloudinary'

const GarmentImage = ({ garment }) => {
  const [isLoading, setIsLoading] = useState(true)

  const handleImageLoaded = () => {
    setIsLoading(false)
  }

  return (
    <>
      <Typography variant='h4' gutterBottom sx={{ mt: 2, textAlign: 'center' }}>
        {garment.name}
      </Typography>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // Maintains aspect ratio
          overflow: 'hidden'
        }}
      >
        {garment.image_cloud_id ? (
          <>
            {isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <CldImage
              src={garment.image_cloud_id}
              alt={garment.name}
              fill
              style={{ objectFit: 'contain' }}
              sizes='(max-width: 600px) 100vw, 600px'
              priority
              onLoad={handleImageLoaded}
              quality='auto:good'
              format='auto'
            />
          </>
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
      </Box>
    </>
  )
}

export default GarmentImage
