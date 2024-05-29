'use client'

import { useState } from 'react'

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'

import AddTodoForm from '@/components/todo/AddTodoForm'
import TodoList from '@/components/todo/TodoList'
import Greeting from '@/components/todo/Greeting'
import BlendedImage from '@/components/ui/BlendedImage'

const ActionsList = () => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography variant='h6' gutterBottom>
              Start from
            </Typography>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <i className='ri-file-add-line' />
                </ListItemIcon>
                <ListItemText primary='New Order' />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <i className='ri-user-add-line' />
                </ListItemIcon>
                <ListItemText primary='New Client' />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <i className='ri-calendar-line' />
                </ListItemIcon>
                <ListItemText primary='New Appointment' />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <i className='ri-service-line' />
                </ListItemIcon>
                <ListItemText primary='New Service' />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <i className='ri-file-list-line' />
                </ListItemIcon>
                <ListItemText primary='New Invoice' />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={4}>
            <BlendedImage
              src='/images/illustrations/seamstress-organizing-clothes.webp'
              alt='Seamstress organizing clothes'
              width={400}
              height={400}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [todos, setTodos] = useState(null)

  return (
    <Box>
      <Grid container spacing={4} alignItems='flex-start'>
        <Grid item xs={12}>
          <Greeting />
        </Grid>
        <Grid item xs={7}>
          <ActionsList />
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
      </Grid>
    </Box>
  )
}
