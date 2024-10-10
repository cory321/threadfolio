'use client'

import React from 'react'

import { UserButton } from '@clerk/nextjs'
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Box } from '@mui/material'

import {
  CalendarToday as CalendarTodayIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material'

import Logo from '@/components/layout/shared/Logo'

const features = [
  {
    title: 'Effortless Appointment Management',
    description: 'Keep your schedule organized with automated SMS reminders.',
    icon: CalendarTodayIcon
  },
  {
    title: 'Comprehensive Client Management',
    description: 'Build stronger relationships with detailed client records.',
    icon: PeopleIcon
  },
  {
    title: 'Order and Garment Tracking',
    description: 'Stay organized with QR code labels for orders and garments.',
    icon: AssignmentIcon
  },
  {
    title: 'Time Tracking & Analytics',
    description: 'Optimize your workflow by understanding where your time goes.',
    icon: AccessTimeIcon
  },
  {
    title: 'Seamless Invoicing and Payments',
    description: 'Get paid faster with professional invoices and online payment options.',
    icon: PaymentIcon
  },
  {
    title: 'Automated Notifications',
    description: 'Keep everyone in the loop with timely updates.',
    icon: NotificationsIcon
  }
]

function HomePage({ userId, token }) {
  return (
    <>
      <AppBar position='static' color='transparent' elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Logo />
          </Box>
          {userId ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <UserButton />
            </Box>
          ) : (
            <>
              <Button color='inherit' href='/login'>
                Login
              </Button>
              <Button variant='contained' color='primary' sx={{ ml: 2 }} href='/register'>
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth='lg'>
        <Box sx={{ my: 8, textAlign: 'center' }}>
          <Typography variant='h2' component='h1' gutterBottom>
            The All-in-One Platform for Clothing Alteration Specialists
          </Typography>
          <Typography variant='h5' component='h2' color='text.secondary' paragraph>
            Manage appointments, track garments, and collect payments—all in one place.
          </Typography>
          {userId ? (
            <Button variant='contained' color='primary' size='large' sx={{ mt: 4 }} href='/dashboard'>
              Go to Dashboard
            </Button>
          ) : (
            <Button variant='contained' color='primary' size='large' sx={{ mt: 4 }} href='/register'>
              Get Started
            </Button>
          )}
        </Box>

        <Grid container spacing={4} justifyContent='center'>
          {features.map((feature, index) => {
            const IconComponent = feature.icon

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconComponent sx={{ color: 'primary.main', fontSize: 60, mb: 2 }} />
                    <Typography variant='h6' component='h3' gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        <Box sx={{ my: 8, textAlign: 'center' }}>
          <Typography variant='h4' component='h2' gutterBottom>
            Why Choose Threadfolio?
          </Typography>
          <Typography variant='body1' paragraph>
            Streamline operations, enhance client satisfaction, and grow your business with data-driven insights.
          </Typography>
          <Button variant='outlined' color='primary' size='large'>
            Learn More
          </Button>
        </Box>
      </Container>
    </>
  )
}

export default HomePage
