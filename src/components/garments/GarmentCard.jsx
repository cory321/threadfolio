import React from 'react'

import { Typography, Box, Paper } from '@mui/material'
import { CldImage } from 'next-cloudinary'

const GarmentCard = ({ garment }) => (
  <Paper
    elevation={0}
    sx={{
      display: 'flex',
      mb: 3,
      width: '100%',
      maxWidth: { xs: '100%', sm: 400 },
      border: '1px solid',
      borderColor: 'grey.200',
      borderRadius: 2,
      overflow: 'hidden'
    }}
  >
    <Box sx={{ width: 150, height: 150, flexShrink: 0 }}>
      {garment.image_cloud_id ? (
        <CldImage
          src={garment.image_cloud_id}
          alt={garment.name}
          width={150}
          height={150}
          crop='fit'
          quality='auto'
          fetchformat='auto'
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'grey.100'
          }}
        >
          <i className='ri-t-shirt-line' style={{ fontSize: '3rem', color: 'grey' }} />
        </Box>
      )}
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, flexGrow: 1 }}>
      <Typography variant='h6' sx={{ mb: 1 }}>
        {garment.name}
      </Typography>
      <Box component='ul' sx={{ pl: 2, m: 0, '& li': { mb: 0.5 } }}>
        {garment.services.map(service => (
          <Typography component='li' variant='body2' key={service.id}>
            {service.name}
          </Typography>
        ))}
      </Box>
    </Box>
  </Paper>
)

export default GarmentCard
