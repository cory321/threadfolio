import React, { useEffect, useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Typography, Box, Grid, CircularProgress } from '@mui/material'

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
      <Grid container spacing={2}>
        {garments.map(garment => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={garment.id}>
            <GarmentCard garment={garment} orderId={garment.order_id} stageColor={garment.stage_color} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
