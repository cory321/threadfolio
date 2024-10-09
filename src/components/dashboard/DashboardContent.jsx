'use client'

import { useState } from 'react'

import dynamic from 'next/dynamic'

import { useMediaQuery, Box, Grid, Card, CardContent, CardHeader } from '@mui/material'

import { defaultBreakpoints } from '@menu/defaultConfigs'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Greeting from '@components/todo/Greeting'
import UpcomingAppointments from '@/components/home/UpcomingAppointments'
import { dismissOnboarding } from '@/app/actions/users'

const GarmentPriority = dynamic(() => import('@/components/home/GarmentPriority'), {
  ssr: false,
  loading: LoadingSpinner
})

const OnboardingWelcome = dynamic(() => import('@/components/OnboardingWelcome'), {
  ssr: false,
  loading: LoadingSpinner
})

const ActionsList = dynamic(() => import('@components/home/ActionsList'), {
  ssr: false,
  loading: LoadingSpinner
})

const AddTodoForm = dynamic(() => import('@components/todo/AddTodoForm'), {
  ssr: false,
  loading: LoadingSpinner
})

const TodoList = dynamic(() => import('@components/todo/TodoList'), {
  ssr: false,
  loading: LoadingSpinner
})

export default function DashboardContent({ showOnboarding: initialShowOnboarding }) {
  const [todos, setTodos] = useState(null)
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
              <CardHeader title='To do list' />
              <CardContent>
                <AddTodoForm todos={todos} setTodos={setTodos} />
                <TodoList todos={todos} setTodos={setTodos} />
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
              <CardContent>
                <UpcomingAppointments />
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
                    <CardHeader title='To do list' />
                    <CardContent>
                      <AddTodoForm todos={todos} setTodos={setTodos} />
                      <TodoList todos={todos} setTodos={setTodos} />
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
