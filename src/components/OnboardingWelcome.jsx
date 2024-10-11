'use client'

import { useState, useEffect } from 'react'

import Image from 'next/image'

import { Button, Card, CardContent, Typography, Collapse, Grow, useTheme } from '@mui/material'

const OnboardingWelcome = ({ onDismiss, isLoading }) => {
  const [isVisible, setIsVisible] = useState(false)

  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  useEffect(() => {
    // Set isVisible to true after component mounts
    setIsVisible(true)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss()
    }, 300) // Wait for the animation to complete before calling onDismiss
  }

  return (
    <Collapse in={isVisible} timeout={300}>
      <Grow in={isVisible} timeout={300}>
        <Card sx={{ mb: 4, overflow: 'hidden' }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ flex: 1, textAlign: 'left' }}>
              <Image
                src={isDarkMode ? '/seamstress-onboarding-dark.webp' : '/seamstress-onboarding-light.webp'}
                alt='A seamstress altering garments'
                width={250}
                height={250}
                priority
              />
            </div>
            <div style={{ flex: 1, paddingRight: '1rem' }}>
              <h1>Getting Started</h1>

              <Typography variant='body1' paragraph>
                Streamline your clothing alteration shop with our suite of tools.
              </Typography>
              <Button variant='contained' color='primary' onClick={handleDismiss} disabled={isLoading}>
                {isLoading ? 'Dismissing...' : 'Dismiss'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grow>
    </Collapse>
  )
}

export default OnboardingWelcome
