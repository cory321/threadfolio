'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { useAuth, UserButton } from '@clerk/nextjs'
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material'

export default function LandingPage() {
  const { userId, getToken } = useAuth()
  const [token, setToken] = useState(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getToken({ template: 'supabase' })

        if (!token) throw new Error('Failed to retrieve token')
        setToken(token)
      } catch (error) {
        console.error(error)
      }
    }

    if (userId) {
      fetchToken()
    }
  }, [userId, getToken])

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            Threadfolio
          </Typography>
          {userId ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <UserButton afterSignOutUrl='/' />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href='/login' passHref>
                <Button color='inherit'>Login</Button>
              </Link>
              <Link href='/register' passHref>
                <Button color='inherit'>Register</Button>
              </Link>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h2' component='h1' gutterBottom>
            Threadfolio
          </Typography>
          <Typography variant='h5' gutterBottom>
            This is the public landing page accessible by everyone.
          </Typography>
          {userId ? (
            <Box sx={{ mt: 4 }}>
              <Link href='/dashboard' passHref>
                <Button variant='contained' color='primary'>
                  Go to Dashboard
                </Button>
              </Link>
            </Box>
          ) : (
            <Box sx={{ mt: 4 }}>
              <Link href='/login' passHref>
                <Button variant='contained' color='primary' sx={{ mr: 2 }}>
                  Login
                </Button>
              </Link>
              <Link href='/register' passHref>
                <Button variant='outlined' color='primary'>
                  Register
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      </Container>
    </>
  )
}
