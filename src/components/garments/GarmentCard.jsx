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
          transition: '0.3s',
          '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 }
        }}
      >
        <Box
          sx={{
            width: '40%',
            position: 'relative',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
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
        </Box>
        <CardContent sx={{ width: '60%', flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Typography variant='h6' gutterBottom noWrap>
            {garment.name}
          </Typography>
          {dueStatus && (
            <Typography variant='body2' color={dueStatus.color} sx={{ fontWeight: 'bold', mb: 1 }}>
              {dueStatus.text}
            </Typography>
          )}
          <Grid container spacing={1}>
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
          <Chip
            label={garment.stage}
            size='small'
            color='primary'
            sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 'bold' }}
          />
        </CardContent>
      </Card>
    </Link>
  )
}

export default GarmentCard
