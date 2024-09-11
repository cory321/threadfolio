'use client'

import React, { useState } from 'react'

import Link from 'next/link'
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
import { styled } from '@mui/material/styles'

const BlendedImage = dynamic(() => import('@/components/ui/BlendedImage'), {
  ssr: false,
  loading: () => (
    <Box display='flex' justifyContent='center' alignItems='center' height={400}>
      <CircularProgress />
    </Box>
  )
})

const AddClientModal = dynamic(() => import('@/components/clients/AddClientModal'), {
  ssr: false,
  loading: () => <CircularProgress />
})

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: '18px',
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4]
  }
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(5px)'
  }
}))

const actions = [
  { icon: 'ri-file-add-line', text: 'New Order', link: '/orders/create' },
  { icon: 'ri-user-add-line', text: 'New Client', link: '/clients' },
  { icon: 'ri-calendar-line', text: 'New Appointment', link: '/appointments' },
  { icon: 'ri-service-line', text: 'New Service', link: '/services' },
  { icon: 'ri-file-list-line', text: 'New Invoice', link: '/finance' }
]

const ActionsList = ({ isMobile }) => {
  const [addClientModalOpen, setAddClientModalOpen] = useState(false)

  const handleNavigation = link => {
    if (link === '/clients') {
      setAddClientModalOpen(true)
    }
  }

  const handleCloseAddClientModal = () => {
    setAddClientModalOpen(false)
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <Typography variant='h6' gutterBottom>
              Start from
            </Typography>
            {isMobile ? (
              actions.map((action, index) =>
                action.link === '/clients' ? (
                  <StyledButton
                    key={index}
                    fullWidth
                    variant='contained'
                    startIcon={<i className={action.icon} />}
                    onClick={() => handleNavigation(action.link)}
                  >
                    {action.text}
                  </StyledButton>
                ) : (
                  <Link href={action.link} key={index} passHref>
                    <StyledButton fullWidth variant='contained' startIcon={<i className={action.icon} />}>
                      {action.text}
                    </StyledButton>
                  </Link>
                )
              )
            ) : (
              <List>
                {actions.map((action, index) =>
                  action.link === '/clients' ? (
                    <StyledListItem
                      key={index}
                      component={ButtonBase}
                      onClick={() => handleNavigation(action.link)}
                      sx={{ width: '100%' }}
                    >
                      <ListItemIcon>
                        <i className={action.icon} />
                      </ListItemIcon>
                      <ListItemText primary={action.text} />
                    </StyledListItem>
                  ) : (
                    <Link href={action.link} key={index} passHref>
                      <StyledListItem component={ButtonBase} sx={{ width: '100%' }}>
                        <ListItemIcon>
                          <i className={action.icon} />
                        </ListItemIcon>
                        <ListItemText primary={action.text} />
                      </StyledListItem>
                    </Link>
                  )
                )}
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
      <AddClientModal open={addClientModalOpen} onClose={handleCloseAddClientModal} />
    </Card>
  )
}

export default ActionsList
