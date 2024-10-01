import React from 'react'

import { Card, CardHeader, CardContent, Typography } from '@mui/material'

const Finances = ({ sx }) => {
  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title='Collect Payment' />
      <CardContent>
        <Typography>
          Button for Add Services to Invoice. Invoicing stuff here. Financial information to be implemented
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Finances
