'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { compareAsc } from 'date-fns'

import { useAuth } from '@clerk/nextjs'
import { Button, Box, Typography, CircularProgress, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material'

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

          const sortedGarments = fetchedGarmentsData.garments.sort((a, b) => {
            if (!a.due_date) return 1
            if (!b.due_date) return -1

            return compareAsc(new Date(a.due_date), new Date(b.due_date))
          })

          setGarmentsData({ ...fetchedGarmentsData, garments: sortedGarments })
        } catch (error) {
          console.error('Failed to fetch garments:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchGarments()
  }, [userId, getToken])

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      )
    }

    if (garmentsData.garments.length === 0) {
      return (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='h6'>No garments found.</Typography>
          <Link href='/orders/create' passHref>
            <Button variant='contained' color='primary' sx={{ mt: 2 }}>
              Create New Order
            </Button>
          </Link>
        </Card>
      )
    }

    return (
      <Grid container spacing={3}>
        {garmentsData.garments
          .sort((a, b) => {
            if (!a.due_date) return 1
            if (!b.due_date) return -1

            return compareAsc(new Date(a.due_date), new Date(b.due_date))
          })
          .map(garment => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={garment.id}>
              <GarmentCard garment={garment} orderId={garment.order_id} />
            </Grid>
          ))}
      </Grid>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4'>Garments</Typography>
        <Link href='/orders/create' passHref>
          <Button variant='contained' color='primary'>
            Create Order
          </Button>
        </Link>
      </Box>
      {renderContent()}
    </Box>
  )
}
