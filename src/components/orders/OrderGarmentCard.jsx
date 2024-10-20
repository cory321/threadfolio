'use client'

import { Typography, Box, Paper, Chip, Grid } from '@mui/material'
import { CldImage } from 'next-cloudinary'
import { format } from 'date-fns'

const OrderGarmentCard = ({ garment }) => (
  <Paper
    elevation={0}
    sx={{
      display: 'flex',
      height: '100%',
      border: '1px solid',
      borderColor: 'grey.200',
      borderRadius: 2,
      overflow: 'hidden',
      transition: 'box-shadow 0.3s',
      '&:hover': {
        boxShadow: 3,
        cursor: 'pointer'
      }
    }}
  >
    <Grid container>
      {/* Left column: Image */}
      <Grid item xs={4}>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {garment.image_cloud_id ? (
            <CldImage
              src={garment.image_cloud_id}
              alt={garment.name}
              width={80}
              height={80}
              crop='fill'
              style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain' }}
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
              <i className='ri-t-shirt-line' style={{ fontSize: '2rem', color: 'grey' }} />
            </Box>
          )}
        </Box>
      </Grid>

      {/* Right column: Garment Details */}
      <Grid item xs={8}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 1, height: '100%' }}>
          <Typography variant='subtitle1' sx={{ mb: 0.5 }}>
            {garment.name}
          </Typography>
          <Chip label={garment.stage_name} size='small' sx={{ alignSelf: 'flex-start', mt: 'auto' }} />
        </Box>
      </Grid>
    </Grid>
  </Paper>
)

export default OrderGarmentCard
