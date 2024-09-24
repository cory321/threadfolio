'use client'

import { useState } from 'react'

import dynamic from 'next/dynamic'

import { useMediaQuery, useTheme, Box, Grid, Card, CardContent } from '@mui/material'

import Greeting from '@components/todo/Greeting'
import { defaultBreakpoints } from '@menu/defaultConfigs'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

import UpcomingAppointments from '@/components/home/UpcomingAppointments'
import GarmentPriority from '@/components/home/GarmentPriority'

const ActionsList = dynamic(() => import('@components/home/ActionsList'), {
  ssr: false,
  loading: LoadingSpinner
})

export default function Home() {
  const theme = useTheme()
  const isMobile = useMediaQuery(`(max-width: ${defaultBreakpoints.sm})`)
  const isStacked = useMediaQuery(`(max-width: ${defaultBreakpoints.lg})`)

  if (isMobile) {
    // For mobile view, stack components vertically
    return (
      <Box>
        <Grid container spacing={4} alignItems='flex-start'>
          <Grid item xs={12}>
            <Greeting />
          </Grid>
          <Grid item xs={12}>
            <ActionsList isMobile={isMobile} />
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <GarmentPriority />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <UpcomingAppointments />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  } else {
    // For desktop view, create a three-column layout
    return (
      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Greeting />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              {/* Quick Actions Column */}
              <Grid item xs={12} md={3}>
                <ActionsList isMobile={isMobile} />
              </Grid>

              {/* Upcoming Appointments Column */}
              <Grid item xs={12} md={5}>
                <Card>
                  <CardContent>
                    <UpcomingAppointments />
                  </CardContent>
                </Card>
              </Grid>

              {/* Garment Priority Column */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <GarmentPriority />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    )
  }
}
