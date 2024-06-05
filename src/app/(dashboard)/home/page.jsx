'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material'

import AddTodoForm from '@/components/todo/AddTodoForm'
import TodoList from '@/components/todo/TodoList'
import Greeting from '@/components/todo/Greeting'
import BlendedImage from '@/components/ui/BlendedImage'
import { defaultBreakpoints } from '@menu/defaultConfigs'

const ActionsList = ({ isMobile }) => {
  const router = useRouter()

  const actions = [
    { icon: 'ri-file-add-line', text: 'New Order', link: '/orders/create' },
    { icon: 'ri-user-add-line', text: 'New Client', link: '/clients' },
    { icon: 'ri-calendar-line', text: 'New Appointment', link: '/appointments' },
    { icon: 'ri-service-line', text: 'New Service', link: '/services' },
    { icon: 'ri-file-list-line', text: 'New Invoice', link: '/finance' }
  ]

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <Typography variant='h6' gutterBottom>
              Start from
            </Typography>
            {isMobile ? (
              actions.map((action, index) => (
                <Button
                  key={index}
                  fullWidth
                  variant='contained'
                  startIcon={<i className={action.icon} />}
                  sx={{ marginBottom: 5, padding: '18px', fontSize: '1.1rem' }}
                  onClick={() => router.push(action.link)}
                >
                  {action.text}
                </Button>
              ))
            ) : (
              <List>
                {actions.map((action, index) => (
                  <ListItem button key={index} onClick={() => router.push(action.link)}>
                    <ListItemIcon>
                      <i className={action.icon} />
                    </ListItemIcon>
                    <ListItemText primary={action.text} />
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>
          {!isMobile && (
            <Grid item sm={7}>
              <BlendedImage
                src='/images/illustrations/seamstress-organizing-clothes.webp'
                alt='Seamstress organizing clothes'
                width={400}
                height={400}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

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
                <CardHeader title='To do list' />
                <CardContent>
                  <AddTodoForm todos={todos} setTodos={setTodos} />
                  <TodoList todos={todos} setTodos={setTodos} />
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
                <CardHeader title='To do list' />
                <CardContent>
                  <AddTodoForm todos={todos} setTodos={setTodos} />
                  <TodoList todos={todos} setTodos={setTodos} />
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}
