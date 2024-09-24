import React, { useEffect, useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Typography, Box, CircularProgress } from '@mui/material'

import GarmentCard from '@/components/garments/GarmentCard'
import { getPrioritizedGarments } from '@/app/actions/garments'

export default function GarmentPriority() {
  const [garments, setGarments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { userId, getToken } = useAuth()

  useEffect(() => {
    const fetchGarments = async () => {
      try {
        const token = await getToken({ template: 'supabase' })

        if (!token) throw new Error('Failed to retrieve token')

        const fetchedGarments = await getPrioritizedGarments(userId, token)

        setGarments(fetchedGarments)
      } catch (error) {
        console.error('Failed to fetch prioritized garments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGarments()
  }, [userId, getToken])

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
      <Typography variant='h6' gutterBottom>
        Garment Priority
      </Typography>
      <Box>
        {garments.map(garment => (
          <Box key={garment.id} mb={2}>
            <GarmentCard garment={garment} orderId={garment.order_id} stageColor={garment.stage_color} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
