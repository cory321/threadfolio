'use client'

import React, { useEffect } from 'react'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

import {
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  ButtonBase,
  CircularProgress,
  Box
} from '@mui/material'

const BlendedImage = dynamic(() => import('@/components/ui/BlendedImage'), {
  ssr: false,
  loading: () => (
    <Box display='flex' justifyContent='center' alignItems='center' height={400}>
      <CircularProgress />
    </Box>
  )
})

const actions = [
  { icon: 'ri-file-add-line', text: 'New Order', link: '/orders/create' },
  { icon: 'ri-user-add-line', text: 'New Client', link: '/clients' },
  { icon: 'ri-calendar-line', text: 'New Appointment', link: '/appointments' },
  { icon: 'ri-service-line', text: 'New Service', link: '/services' },
  { icon: 'ri-file-list-line', text: 'New Invoice', link: '/finance' }
]

const ActionsList = ({ isMobile }) => {
  const router = useRouter()

  const handleNavigation = link => {
    router.push(link)
  }

  useEffect(() => {
    actions.forEach(action => {
      router.prefetch(action.link)
    })
  }, [router])

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
                  onClick={() => handleNavigation(action.link)}
                >
                  {action.text}
                </Button>
              ))
            ) : (
              <List>
                {actions.map((action, index) => (
                  <ListItem
                    key={index}
                    component={ButtonBase}
                    onClick={() => handleNavigation(action.link)}
                    sx={{ width: '100%' }}
                  >
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
                loading='lazy'
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ActionsList
