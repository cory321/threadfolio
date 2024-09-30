import React from 'react'

import { Card, CardHeader, CardContent, Typography } from '@mui/material'

const TimeTracker = ({ sx }) => {
  return (
    <Card sx={sx}>
      <CardHeader title='Time Tracker' />
      <CardContent>
        <Typography>Time tracking functionality to be implemented</Typography>
      </CardContent>
    </Card>
  )
}

export default TimeTracker
