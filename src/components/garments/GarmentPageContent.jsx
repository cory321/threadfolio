'use client'

import { useState } from 'react'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { useAuth } from '@clerk/nextjs'
import { Box, Typography, Card, CardContent, CircularProgress, Grid, Button, Divider } from '@mui/material'

import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatOrderNumber } from '@/utils/formatOrderNumber'
import GarmentImage from '@/components/garments/garment-single-view/GarmentImage'
import ClientInformation from '@/components/garments/garment-single-view/ClientInformation'
import ServicesSection from '@/components/garments/garment-single-view/ServicesSection'
import StageSelector from '@/components/garments/garment-single-view/StageSelector'
import GarmentNotes from '@/components/garments/garment-single-view/GarmentNotes'
import GarmentDates from '@/components/garments/garment-single-view/GarmentDates'
import ScheduleAppointment from '@/components/garments/garment-single-view/ScheduleAppointment'
import TimeTracker from '@/components/garments/garment-single-view/TimeTracker'
import Finances from '@/components/garments/garment-single-view/Finances'

export default function GarmentPageContent({ initialGarment, initialStages }) {
  const [garment, setGarment] = useState(initialGarment)
  const [stages, setStages] = useState(initialStages)
  const [isLoading, setIsLoading] = useState(false)
  const { orderId } = useParams()
  const searchParams = useSearchParams()

  const fromPage = searchParams.get('from')
  const showBackButton = fromPage === 'garments' || fromPage === 'home'

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!garment) {
    return <Typography>Garment not found.</Typography>
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {showBackButton && (
          <>
            <Link href={fromPage === 'home' ? '/' : '/garments'} passHref>
              <Button variant='text' component='a'>
                &lt; Back to {fromPage === 'home' ? 'Home' : 'Garments'}
              </Button>
            </Link>
            <Divider
              orientation='vertical'
              flexItem
              sx={{ ml: { xs: 1, sm: 2 }, mr: 4, borderRightWidth: 2, borderColor: 'grey.300' }}
            />
          </>
        )}
        <Breadcrumb
          items={[
            { label: 'Orders', href: '/orders' },
            {
              label: `Order #${formatOrderNumber(garment.user_order_number)}`,
              href: `/orders/${orderId}`
            },
            { label: garment.name, href: `/orders/${orderId}/${garment.id}` }
          ]}
        />
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Left Column */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <GarmentImage garment={garment} />
              <GarmentDates garment={garment} />
            </CardContent>
          </Card>
          <ClientInformation client={garment.client} />
        </Grid>

        {/* Middle Column */}
        <Grid item xs={12} md={6}>
          <ServicesSection garment={garment} setGarment={setGarment} />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={3}>
          <StageSelector garment={garment} setGarment={setGarment} stages={stages} />
          <ScheduleAppointment client={{ id: garment.client.id, full_name: garment.client.full_name }} />
          <TimeTracker sx={{ mt: 2 }} />
          <Finances sx={{ mt: 2 }} />
          <GarmentNotes notes={garment.notes} />
        </Grid>
      </Grid>
    </>
  )
}
