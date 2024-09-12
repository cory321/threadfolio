'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { useAuth } from '@clerk/nextjs'
import { Button, Box, Typography, CircularProgress, Grid } from '@mui/material'

import { getGarments } from '@/app/actions/garments'
import GarmentCard from '@/components/garments/GarmentCard'

export default function GarmentsPage() {
  const [garmentsData, setGarmentsData] = useState({ garments: [], totalCount: 0, page: 1, pageSize: 10 })
  const [isLoading, setIsLoading] = useState(true)
  const { userId, getToken } = useAuth()

  useEffect(() => {
    async function fetchGarments() {
      if (userId) {
        try {
          setIsLoading(true)
          const token = await getToken({ template: 'supabase' })

          if (!token) throw new Error('Failed to retrieve token')
          const fetchedGarmentsData = await getGarments(userId, token)

          setGarmentsData(fetchedGarmentsData)
          setIsLoading(false)
        } catch (error) {
          console.error('Failed to fetch garments:', error)
          setIsLoading(false)
        }
      }
    }

    fetchGarments()
  }, [userId, getToken])

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      )
    }

    if (garmentsData.garments.length === 0) {
      return <Typography>No garments found.</Typography>
    }

    return (
      <Grid container spacing={3}>
        {garmentsData.garments.map(garment => (
          <Grid item xs={12} key={garment.id}>
            <GarmentCard garment={garment} />
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
        <h1>Garments</h1>
        <Link href='/orders/create' passHref>
          <Button variant='contained' color='primary'>
            Create Order
          </Button>
        </Link>
      </Box>
      {renderContent()}
    </>
  )
}
