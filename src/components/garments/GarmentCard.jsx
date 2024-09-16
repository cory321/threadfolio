import React from 'react'

import Link from 'next/link'

import { Typography, Box, Card, CardContent, Chip, Grid, Avatar, CardActionArea, useTheme } from '@mui/material'
import { CldImage } from 'next-cloudinary'
import { format, differenceInDays } from 'date-fns'
import EventIcon from '@mui/icons-material/Event'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

import { getContrastText } from '@/utils/colorUtils'

/**
 * Determines the status color and text based on the due date.
 * @param {string | Date} date - The due date of the garment.
 * @returns {object} - An object containing the color and status text.
 */
const getDateStatus = date => {
  const today = new Date()
  const diffDays = differenceInDays(new Date(date), today)

  if (diffDays < 0) return { color: 'error.main', text: `${Math.abs(diffDays)} days overdue` }
  if (diffDays <= 7) return { color: 'warning.main', text: 'Due soon' }

  return { color: 'success.main', text: 'On track' }
}

/**
 * Reusable StatusBadge component for displaying status chips.
 * @param {object} props - Component props.
 * @param {string} props.type - Type of status ('due' or 'stage').
 * @param {string} props.label - Text to display inside the chip.
 * @returns {JSX.Element}
 */
const StatusBadge = ({ type, label }) => {
  const statusColors = {
    due: {
      Overdue: 'error.main',
      'Due soon': 'warning.main',
      'On track': 'success.main'
    },
    stage: {
      'In Production': 'primary.main',
      Completed: 'secondary.main'

      // Add more stages and corresponding colors as needed
    }
  }

  const color = statusColors[type][label] || 'grey.500'

  return (
    <Chip
      label={label}
      size='small'
      sx={{
        backgroundColor: color,
        color: 'white',
        fontWeight: 'bold'
      }}
    />
  )
}

const GarmentCard = ({ garment, orderId, stageColor }) => {
  const stageName = garment.stage_name || 'Unknown'
  const theme = useTheme()
  const defaultColor = theme.palette.grey[500]

  // Determine background color
  let backgroundColor = stageColor || defaultColor

  // Ensure backgroundColor starts with '#'
  if (
    typeof backgroundColor === 'string' &&
    !backgroundColor.startsWith('#') &&
    /^([0-9A-F]{6}|[0-9A-F]{3})$/i.test(backgroundColor)
  ) {
    backgroundColor = `#${backgroundColor}`
  }

  // Calculate contrast text color
  const textColor = getContrastText(backgroundColor)

  const dateStatus = garment.due_date ? getDateStatus(garment.due_date) : null

  return (
    <Link href={`/orders/${orderId}/${garment.id}`} passHref style={{ textDecoration: 'none', width: '100%' }}>
      <CardActionArea sx={{ height: '100%' }}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: '0.3s',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
            padding: 2,
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          {/* Card Header: Garment Title and Stage Chip */}
          <Grid container alignItems='center' justifyContent='space-between' spacing={1}>
            <Grid item xs={8}>
              {/* Garment Title */}
              <Typography variant='h6' component='div' noWrap>
                {garment.name}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              {/* Stage Chip */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Chip
                  label={stageName}
                  size='small'
                  sx={{
                    backgroundColor: backgroundColor,
                    color: textColor,
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Divider */}
          <Box sx={{ borderBottom: '1px solid', borderColor: 'grey.300', my: 2 }} />

          {/* Main Content: Image and Details */}
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            {/* Image Section */}
            <Grid item xs={4}>
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                  paddingBottom: '100%',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                {garment.image_cloud_id ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <CldImage
                      src={garment.image_cloud_id}
                      alt={garment.name}
                      fill
                      style={{
                        objectFit: 'contain'
                      }}
                      options={{
                        quality: 'auto',
                        fetchFormat: 'auto',
                        responsive: true
                      }}
                      loading='lazy'
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.100'
                    }}
                  >
                    <i className='ri-t-shirt-line' style={{ color: 'grey', fontSize: '3rem' }} />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Details Section */}
            <Grid item xs={8}>
              <CardContent
                sx={{
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                {/* Due Status as Text */}
                {dateStatus && (
                  <Typography
                    variant='body2'
                    sx={{
                      color: dateStatus.color,
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    {dateStatus.text}
                  </Typography>
                )}

                {/* Due Date */}
                {garment.due_date && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon
                      fontSize='small'
                      sx={{ mr: 1, color: 'text.secondary' }}
                      aria-label='Due Date Icon'
                    />
                    <Typography variant='body2'>Due: {format(new Date(garment.due_date), 'MMM d, yyyy')}</Typography>
                  </Box>
                )}

                {/* Event Info */}
                {garment.is_event && garment.event_date && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon fontSize='small' sx={{ mr: 1, color: 'text.secondary' }} aria-label='Event Info Icon' />
                    <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                      Event: {format(new Date(garment.event_date), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                )}

                {/* Services */}
                <Box sx={{ mt: 'auto' }}>
                  <Typography variant='subtitle2' sx={{ mb: 0.5 }}>
                    Services:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {garment.services?.slice(0, 3).map(service => (
                      <Chip key={service.id} label={service.name} size='small' variant='outlined' />
                    ))}
                    {garment.services?.length > 3 && (
                      <Chip label={`+${garment.services.length - 3} more`} size='small' variant='outlined' />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </CardActionArea>
    </Link>
  )
}

export default GarmentCard
