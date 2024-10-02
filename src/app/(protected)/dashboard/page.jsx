'use client'

import { useState } from 'react'

import dynamic from 'next/dynamic'

import { useMediaQuery, Box, Grid, Card, CardContent, CardHeader } from '@mui/material'

import Greeting from '@components/todo/Greeting'
import { defaultBreakpoints } from '@menu/defaultConfigs'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UpcomingAppointments from '@/components/home/UpcomingAppointments'
import GarmentPriority from '@/components/home/GarmentPriority'

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

export default function Home() {
  const [todos, setTodos] = useState(null)
  const isMobile = useMediaQuery(`(max-width: ${defaultBreakpoints.sm})`)

  if (isMobile) {
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
