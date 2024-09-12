import React from 'react'

import Link from 'next/link'

import { Typography, Box, Paper, Chip, Grid } from '@mui/material'
import { CldImage } from 'next-cloudinary'
import { format } from 'date-fns'

import { formatPhoneNumber } from '@/utils/formatPhoneNumber'

const GarmentCard = ({ garment }) => (
  <Link href={`/garments/${garment.id}`} passHref style={{ textDecoration: 'none' }}>
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        mb: 3,
        width: '100%',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      <Grid container alignItems='center'>
        {/* Left column: Image */}
        <Grid item xs={12} sm={3} md={2}>
          <Box sx={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {garment.image_cloud_id ? (
              <CldImage
                src={garment.image_cloud_id}
                alt={garment.name}
                width={100}
                height={100}
                crop='fill'
                style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }}
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
        </Grid>

        {/* Middle-left column: Garment Details */}
        <Grid item xs={12} sm={3} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, height: '100%' }}>
            <Typography variant='h6' sx={{ mb: 1 }}>
              {garment.name}
            </Typography>
            {garment.due_date && (
              <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                Due: {format(new Date(garment.due_date), 'MMM d, yyyy')}
              </Typography>
            )}
            {garment.is_event && garment.event_date && (
              <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                Event: {format(new Date(garment.event_date), 'MMM d, yyyy')}
              </Typography>
            )}
            <Chip label={garment.stage} size='small' sx={{ alignSelf: 'flex-start', mb: 1 }} />
          </Box>
        </Grid>

        {/* Middle-right column: Services */}
        <Grid item xs={12} sm={3} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, height: '100%' }}>
            <Typography variant='subtitle2' sx={{ mb: 0.5 }}>
              Services:
            </Typography>
            <Box component='ul' sx={{ pl: 2, m: 0, '& li': { mb: 0.5 } }}>
              {garment.services.map(service => (
                <Typography component='li' variant='body2' key={service.id}>
                  {service.name}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right column: Client Information */}
        <Grid item xs={12} sm={3} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, height: '100%' }}>
            <Typography variant='subtitle2' sx={{ mb: 0.5 }}>
              Client:
            </Typography>
            {garment.client ? (
              <>
                <Typography variant='body2'>{garment.client.full_name}</Typography>
                <Typography variant='body2'>{garment.client.email}</Typography>
                <Typography variant='body2'>{formatPhoneNumber(garment.client.phone_number)}</Typography>
              </>
            ) : (
              <Typography variant='body2'>No client information available</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  </Link>
)

export default GarmentCard
