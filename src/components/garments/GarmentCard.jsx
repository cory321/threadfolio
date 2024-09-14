import React from 'react'

import Link from 'next/link'

import { Typography, Box, Card, CardContent, Chip, Grid, Avatar } from '@mui/material'
import { CldImage } from 'next-cloudinary'
import { format, differenceInDays } from 'date-fns'
import EventIcon from '@mui/icons-material/Event'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const getDateColor = date => {
  const today = new Date()
  const diffDays = differenceInDays(new Date(date), today)

  if (diffDays < 0) return { color: '#D32F2F', text: `${Math.abs(diffDays)} days overdue` }
  if (diffDays <= 7) return { color: '#F57C00', text: 'Due soon' }

  return { color: '#388E3C', text: 'On track' }
}

const GarmentCard = ({ garment, orderId }) => {
  const dueStatus = garment.due_date ? getDateColor(garment.due_date) : null

  return (
    <Link href={`/orders/${orderId}/${garment.id}`} passHref style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: '0.3s',
          '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 },
          position: 'relative',
          padding: 2
        }}
      >
        {/* Top Row: Garment Title and Due Status */}
        <Grid container alignItems='center' justifyContent='space-between' spacing={2}>
          <Grid item>
            {/* Garment Title */}
            <Typography variant='h6' gutterBottom noWrap>
              {garment.name}
            </Typography>
          </Grid>
          <Grid item>
            {/* Due Status */}
            {dueStatus && (
              <Typography variant='body2' sx={{ color: dueStatus.color, fontWeight: 'bold' }}>
                {dueStatus.text}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ borderBottom: '1px solid', borderColor: 'grey.300', my: 2 }} />

        {/* Bottom Section: Image and Details */}
        <Grid container spacing={2}>
          {/* Left Column: Image */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                width: '100%',
                position: 'relative', // Required for CldImage with fill
                paddingTop: '100%', // 1:1 Aspect Ratio
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              {garment.image_cloud_id ? (
                <CldImage
                  src={garment.image_cloud_id}
                  alt={garment.name}
                  fill
                  style={{
                    objectFit: 'contain'
                  }}
                  options={{
                    quality: 'auto',
                    fetchFormat: 'auto'
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'grey.100',
                    fontSize: '3rem'
                  }}
                >
                  <i className='ri-t-shirt-line' style={{ color: 'grey' }} />
                </Avatar>
              )}
            </Box>
          </Grid>

          {/* Right Column: Details */}
          <Grid item xs={12} sm={8}>
            <CardContent sx={{ padding: 0 }}>
              <Grid container spacing={1}>
                {/* Stage Chip */}
                <Grid item xs={12}>
                  <Chip label={garment.stage} size='small' color='primary' sx={{ fontWeight: 'bold' }} />
                </Grid>

                {garment.due_date && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon fontSize='small' sx={{ mr: 1 }} />
                      <Typography variant='body2'>
                        Due:{' '}
                        <span style={{ color: dueStatus.color, fontWeight: 'bold' }}>
                          {format(new Date(garment.due_date), 'MMM d, yyyy')}
                        </span>
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {garment.is_event && garment.event_date && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EventIcon fontSize='small' sx={{ mr: 1 }} />
                      <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                        Event: {format(new Date(garment.event_date), 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant='subtitle2' sx={{ mt: 1, mb: 0.5 }}>
                    Services:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {garment.services.slice(0, 3).map(service => (
                      <Chip key={service.id} label={service.name} size='small' variant='outlined' />
                    ))}
                    {garment.services.length > 3 && (
                      <Chip label={`+${garment.services.length - 3} more`} size='small' variant='outlined' />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Link>
  )
}

export default GarmentCard
