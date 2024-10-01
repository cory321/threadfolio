'use client'

import { useState } from 'react'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Button,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material'

import { toast } from 'react-toastify'
import { useAuth } from '@clerk/nextjs'

import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatOrderNumber } from '@/utils/formatOrderNumber'
import GarmentImage from '@/components/garments/garment-single-view/GarmentImage'
import ClientInformation from '@/components/garments/garment-single-view/ClientInformation'
import ServicesSection from '@/components/garments/garment-single-view/ServicesSection'
import StageSelector from '@/components/garments/garment-single-view/StageSelector'
import GarmentNotes from '@/components/garments/garment-single-view/GarmentNotes'
import GarmentDates from '@/components/garments/garment-single-view/GarmentDates'
import TimeTracker from '@/components/garments/garment-single-view/TimeTracker'
import Finances from '@/components/garments/garment-single-view/Finances'

export default function GarmentPageContent({
  initialGarment,
  initialStages,
  handleAddGarmentService,
  handleUpdateServiceDoneStatus,
  userId,
  token,
  updateGarmentNotes
}) {
  const [garment, setGarment] = useState(initialGarment)
  const [stages] = useState(initialStages)
  const [isLoading, setIsLoading] = useState(false)
  const { orderId } = useParams()
  const searchParams = useSearchParams()
  const { getToken } = useAuth()

  const fromPage = searchParams.get('from')
  const showBackButton = fromPage === 'garments' || fromPage === 'home'

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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

  // Function to handle updating notes
  const handleUpdateNotes = async newNotes => {
    try {
      // Optimistically update the UI
      setGarment(prevGarment => ({
        ...prevGarment,
        notes: newNotes
      }))

      // Call the update function passed down from the server component
      await updateGarmentNotes(newNotes)

      toast.success('Notes updated successfully.')
    } catch (error) {
      console.error('Failed to update notes:', error)
      toast.error('Failed to update notes. Please try again.')

      // Revert to previous notes on error
      setGarment(prevGarment => ({
        ...prevGarment,
        notes: prevGarment.notes
      }))
    }
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

          {/* Render StageSelector below GarmentImage on mobile */}

          {isMobile && <StageSelector garment={garment} setGarment={setGarment} stages={stages} marginTop={3} />}

          <ClientInformation client={garment.client} />

          {/* Render Finances below ClientInformation on mobile */}

          {isMobile && <Finances sx={{ mt: 2 }} />}
        </Grid>

        {/* Middle Column */}
        <Grid item xs={12} md={6}>
          <ServicesSection
            garment={garment}
            setGarment={setGarment}
            handleAddGarmentService={handleAddGarmentService}
            handleUpdateServiceDoneStatus={handleUpdateServiceDoneStatus}
            userId={userId}
          />
          {/* Render TimeTracker above GarmentNotes on mobile */}
          {isMobile && (
            <Box sx={{ mt: 2 }}>
              <TimeTracker
                garmentId={garment.id}
                services={garment.services}
                userId={userId}
                token={token}
                garmentName={garment.name}
              />
            </Box>
          )}
          <GarmentNotes notes={garment.notes} onUpdateNotes={handleUpdateNotes} marginTop={3} />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={3}>
          {/* Render StageSelector on desktop screens */}
          {!isMobile && <StageSelector garment={garment} setGarment={setGarment} stages={stages} />}

          {/* Render TimeTracker on desktop screens */}
          {!isMobile && (
            <Box sx={{ mt: 2 }}>
              <TimeTracker
                garmentId={garment.id}
                services={garment.services}
                userId={userId}
                token={token}
                garmentName={garment.name}
              />
            </Box>
          )}
          {/* Render Finances on desktop screens */}
          {!isMobile && <Finances sx={{ mt: 2 }} />}
        </Grid>
      </Grid>
    </>
  )
}
