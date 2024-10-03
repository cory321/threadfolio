'use client'

import { useState, useEffect } from 'react'

import { Button, Card, CardContent, Typography, Collapse, Grow } from '@mui/material'

const OnboardingWelcome = ({ onDismiss, isLoading }) => {
  const [isVisible, setIsVisible] = useState(false)

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
          <CardContent>
            <Typography variant='h5' gutterBottom>
              Welcome to Threadfolio, first time user!
            </Typography>
            <Button variant='contained' color='primary' onClick={handleDismiss} disabled={isLoading}>
              {isLoading ? 'Dismissing...' : 'Dismiss'}
            </Button>
          </CardContent>
        </Card>
      </Grow>
    </Collapse>
  )
}

export default OnboardingWelcome
