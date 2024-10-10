import React from 'react'

import useSWR from 'swr'

import { Typography, Box, CircularProgress, Avatar } from '@mui/material'
import CheckroomIcon from '@mui/icons-material/Checkroom'

import GarmentCard from '@/components/garments/GarmentCard'
import { getPrioritizedGarments } from '@/app/actions/garmentServices'

const fetcher = () => getPrioritizedGarments()

export default function GarmentPriority() {
  const { data: garments, error } = useSWR('getPrioritizedGarments', fetcher)

  if (error) {
    return <Typography>Failed to load garments.</Typography>
  }

  if (!garments) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (garments.length === 0) {
    return <Typography>No garments to display.</Typography>
  }

  return (
    <Box>
      <Box display='flex' alignItems='center' mb={2}>
        <Avatar sx={{ mr: 1 }}>
          <CheckroomIcon />
        </Avatar>
        <Typography variant='h6'>High Priority Garments</Typography>
      </Box>
      <Box>
        {garments.map(garment => (
          <Box key={garment.id} mb={2}>
            <GarmentCard
              garment={garment}
              orderId={garment.order_id}
              stageColor={garment.stage_color}
              from='dashboard'
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
