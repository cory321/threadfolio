import React, { useEffect, useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Typography, Box, CircularProgress, Avatar } from '@mui/material'
import CheckroomIcon from '@mui/icons-material/Checkroom'

import GarmentCard from '@/components/garments/GarmentCard'
import { getPrioritizedGarments } from '@/app/actions/garmentServices'

export default function GarmentPriority() {
  const [garments, setGarments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { userId } = useAuth()

  useEffect(() => {
    const fetchGarments = async () => {
      try {
        const fetchedGarments = await getPrioritizedGarments(userId)

        setGarments(fetchedGarments)
      } catch (error) {
        console.error('Failed to fetch prioritized garments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGarments()
  }, [userId])

  if (isLoading) {
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
