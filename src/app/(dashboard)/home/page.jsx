'use client'

import { useState } from 'react'

import dynamic from 'next/dynamic'

import { useMediaQuery, useTheme, Box, Grid, Card, CardContent, CardHeader, Avatar, Typography } from '@mui/material'

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
  const [todos, setTodos] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(`(max-width: ${defaultBreakpoints.sm})`)
  const isStacked = useMediaQuery(`(max-width: ${defaultBreakpoints.lg})`)

  return (
    <Box>
      <Grid container spacing={4} alignItems='flex-start'>
        <Grid item xs={12}>
          <Greeting />
        </Grid>
        {isMobile || isStacked ? (
          <>
            <Grid item xs={12}>
              <ActionsList isMobile={isMobile} />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <UpcomingAppointments />
                </CardContent>
              </Card>
            </Grid>
            {/* Add the GarmentPriority section */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <GarmentPriority />
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={7}>
              <ActionsList isMobile={isMobile} />
            </Grid>
            <Grid item xs={5}>
              <Card>
                <CardContent>
                  <UpcomingAppointments />
                </CardContent>
              </Card>
              <Box mt={4}>
                <Card>
                  <CardContent>
                    <GarmentPriority />
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}
