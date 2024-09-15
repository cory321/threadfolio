import React from 'react'

import { Card, CardHeader, CardContent, Typography } from '@mui/material'

const Finances = ({ sx }) => {
  return (
    <Card sx={sx}>
      <CardHeader title='Finances' />
      <CardContent>
        <Typography>Financial information to be implemented</Typography>
      </CardContent>
    </Card>
  )
}

export default Finances
