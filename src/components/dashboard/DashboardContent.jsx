'use client'

import { useState } from 'react'

import { useMediaQuery, Box, Grid, Card, CardContent, CardHeader } from '@mui/material'

import { defaultBreakpoints } from '@menu/defaultConfigs'
import Greeting from '@components/todo/Greeting'
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments'
import { dismissOnboarding } from '@/app/actions/users'

import GarmentPriority from '@/components/dashboard/GarmentPriority'

import OnboardingWelcome from '@/components/OnboardingWelcome'
import ActionsList from '@components/dashboard/ActionsList'
import TodoList from '@components/todo/TodoList'

export default function DashboardContent({ showOnboarding: initialShowOnboarding }) {
  const [showOnboarding, setShowOnboarding] = useState(initialShowOnboarding)
  const isMobile = useMediaQuery(`(max-width: ${defaultBreakpoints.sm})`)

  const handleDismissOnboarding = async () => {
    try {
      await dismissOnboarding()
      setShowOnboarding(false)
    } catch (error) {
      console.error('Error dismissing onboarding:', error)
    }
  }

  if (isMobile) {
    return (
      <Box>
        <Grid container spacing={4} alignItems='flex-start'>
          <Grid item xs={12}>
            <Greeting />
          </Grid>
          {showOnboarding && (
            <Grid item xs={12}>
              <OnboardingWelcome onDismiss={handleDismissOnboarding} />
            </Grid>
          )}
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
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <GarmentPriority />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title='Todo List' />
              <CardContent>
                <TodoList />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  } else {
    return (
      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Greeting />
          </Grid>
          {showOnboarding && (
            <Grid item xs={12}>
              <OnboardingWelcome onDismiss={handleDismissOnboarding} />
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <ActionsList isMobile={isMobile} />
                <Box mt={4}>
                  <Card>
                    <CardHeader title='Todo List' />
                    <CardContent>
                      <TodoList />
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <UpcomingAppointments />
                  </CardContent>
                </Card>
              </Grid>
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
